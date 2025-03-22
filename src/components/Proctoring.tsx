import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import swal from "sweetalert";
import * as posenet from "@tensorflow-models/posenet";

export const ProctoringSystem = ({ setIsProctoringEnabled, isGameStarted }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // State for idle, alert, and alert counts
  const [isIdle, setIsIdle] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertCounts, setAlertCounts] = useState({
    gazeLeft: 0,
    gazeRight: 0,
    idle: 0,
    tabSwitch: 0,
    fullscreenExit: 0,
    multipleScreens: 0,
    backgroundNoise: 0
  });

  // Refs to store intervals and event handlers so they can be cleared/removed later
  const posenetIntervalRef = useRef(null);
  const idleIntervalRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const audioStreamRef = useRef(null);
  const handleVisibilityChangeRef = useRef(null);
  const handleFullscreenChangeRef = useRef(null);
  const gazeDirectionRef = useRef({
    direction: null,
    time: 0
  });
  const IDLE_TIME_THRESHOLD = 10; // Idle time threshold in seconds
  const GAZE_ALERT_TIME_THRESHOLD = 3; // Alert time threshold in seconds

  // Function to display alerts if one is not already visible
  const showAlert = (title, text, icon, alertType) => {
    if (!isAlertVisible) {
      setIsAlertVisible(true);
      setAlertCounts(prevCounts => ({
        ...prevCounts,
        [alertType]: prevCounts[alertType] + 1
      }));
      swal(title, text, icon).then(() => {
        setIsAlertVisible(false);
      });
    }
  };

  // Start proctoring when isGameStarted is true. Stop/cleanup when false or unmounting.
  useEffect(() => {
    if (isGameStarted) {
      console.log("Proctoring enabled: as game is Started -------------", isGameStarted);
      // setIsProctoringEnabled(true);
      runPosenet(); //working
      // monitorIdleTime(); //working
      detectTabSwitching(); //working code
      // detectFullscreenExit();
      // checkMultipleMonitors();
      // startAudioMonitoring();
    } else {
      console.log("Proctoring disabled: as game is not Started -------------", isGameStarted);
      // setIsProctoringEnabled(false);
      stopProctoring();
    }

    return () => {
      stopProctoring();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameStarted]);


  // Stop all proctoring features and clean up resources
  const stopProctoring = () => {
    // Clear posenet interval
    if (posenetIntervalRef.current) {
      clearInterval(posenetIntervalRef.current);
      posenetIntervalRef.current = null;
    }
    // Clear idle monitoring interval
    if (idleIntervalRef.current) {
      clearInterval(idleIntervalRef.current);
      idleIntervalRef.current = null;
    }
    // Clear audio monitoring interval
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    // Remove event listeners for tab switching and fullscreen exit
    if (handleVisibilityChangeRef.current) {
      document.removeEventListener("visibilitychange", handleVisibilityChangeRef.current);
      handleVisibilityChangeRef.current = null;
    }
    if (handleFullscreenChangeRef.current) {
      document.removeEventListener("fullscreenchange", handleFullscreenChangeRef.current);
      handleFullscreenChangeRef.current = null;
    }
    // Remove idle tracking events
    document.onmousemove = null;
    document.onkeypress = null;
    // Stop audio stream if available
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
  };

  // Load and run PoseNet. The detection loop is stored in an interval for cleanup.
  const runPosenet = async () => {
    try {
      const net = await posenet.load({
        architecture: "ResNet50",
        inputResolution: { width: 640, height: 480 },
        outputStride: 32
      });
      posenetIntervalRef.current = setInterval(() => detectPose(net), 1000);
    } catch (error) {
      console.error("Error loading PoseNet:", error);
    }
  };

  // Perform pose estimation and check gaze direction
  const detectPose = async (net) => {
    if (webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const pose = await net.estimateSinglePose(video, { flipHorizontal: false });
      checkGazeDirection(pose.keypoints, 0.8);
    }
  };

  // Check if user’s head pose suggests they are looking away
  const checkGazeDirection = (keypoints, minConfidence) => {
    const leftEar = keypoints[3];
    const rightEar = keypoints[4];

    let newGazeDirection = null;
    
    if (leftEar.score < minConfidence) {
        newGazeDirection = "right";
    } else if (rightEar.score < minConfidence) {
        newGazeDirection = "left";
    }

    if (newGazeDirection) {
      if (gazeDirectionRef.current.direction === newGazeDirection) {
          gazeDirectionRef.current.time += 1;
      } else {
          // Reset if user changes direction or looks straight
          gazeDirectionRef.current.direction = newGazeDirection;
          gazeDirectionRef.current.time = 1;
      }

      if (gazeDirectionRef.current.time >= GAZE_ALERT_TIME_THRESHOLD) { // Alert after 5 sec
          showAlert(
              "Possible cheating!", 
              "You've been looking away for too long.", 
              "error", 
              "cheating"
          );
          gazeDirectionRef.current.time = 0; // Reset after alert
      }
  } else {
      // Reset if user is looking at the screen
      gazeDirectionRef.current.direction = null;
      gazeDirectionRef.current.time = 0;
  }
  };

  // Monitor user idle time via mouse and keyboard events
  const monitorIdleTime = () => {
    let idleTime = 0;
    const resetIdle = () => {
      idleTime = 0;
      setIsIdle(false);
    };

    document.onmousemove = resetIdle;
    document.onkeypress = resetIdle;

    idleIntervalRef.current = setInterval(() => {
      idleTime++;
      if (idleTime > IDLE_TIME_THRESHOLD && !isAlertVisible) {
        setIsIdle(true);
        showAlert("Are you still there?", "You've been idle for too long!", "warning", "idle");
      }
    }, 1000);
  };

  // Listen for tab switching using the visibility API
  const detectTabSwitching = () => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isAlertVisible) {
        showAlert("Tab Change Detected!", "Please stay on the exam screen!", "error", "tabSwitch");
      }
    };
    handleVisibilityChangeRef.current = handleVisibilityChange;
    document.addEventListener("visibilitychange", handleVisibilityChange);
  };

  // Listen for fullscreen exit events
  const detectFullscreenExit = () => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !isAlertVisible) {
        showAlert("Fullscreen Exited!", "Your answers might be reset!", "error", "fullscreenExit");
      }
    };
    handleFullscreenChangeRef.current = handleFullscreenChange;
    document.addEventListener("fullscreenchange", handleFullscreenChange);
  };

  // Check for multiple monitor usage by trying to capture the display media briefly
  const checkMultipleMonitors = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((stream) => {
        if (isGameStarted && !isAlertVisible) {
          showAlert("Multiple Screens Detected!", "Only use one screen.", "error", "multipleScreens");
        }
        // Stop the stream immediately after checking
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(() => {});
  };

  // Monitor background noise using the audio stream
  const startAudioMonitoring = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioStreamRef.current = stream;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioIntervalRef.current = setInterval(() => {
          analyser.getByteFrequencyData(dataArray);
          const averageVolume = dataArray.reduce((a, b) => a + b) / bufferLength;
          if (averageVolume > 50 && !isAlertVisible) {
            showAlert("Background Noise Detected!", "Please stay in a quiet environment.", "error", "backgroundNoise");
          }
        }, 3000);
      })
      .catch((error) => console.error("Error in audio monitoring:", error));
  };

  return (
    <div>
      {isGameStarted && (
        <>
          <Webcam ref={webcamRef} style={{ width: 200, height: 200 , padding:16 }} />
          {/* <canvas ref={canvasRef} style={{ width: 50, height: 50 , zIndex:1000}} /> */}
        </>
      )}
      {isIdle && <p>You have been idle!</p>}
      {/* <div>
        <p>Alert Counts:</p>
        <ul>
          <li>Gaze Left: {alertCounts.gazeLeft}</li>
          <li>Gaze Right: {alertCounts.gazeRight}</li>
          <li>Idle: {alertCounts.idle}</li>
          <li>Tab Switch: {alertCounts.tabSwitch}</li>
          <li>Fullscreen Exit: {alertCounts.fullscreenExit}</li>
          <li>Multiple Screens: {alertCounts.multipleScreens}</li>
          <li>Background Noise: {alertCounts.backgroundNoise}</li>
        </ul>
      </div> */}
    </div>
  );
};
