import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import swal from "sweetalert";
import * as posenet from "@tensorflow-models/posenet";

export const ProctoringSystem = ({ onStatusChange }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const absenceRef = useRef(0);
    const gazeDirectionRef = useRef({ direction: null, time: 0 });
    const idleRef = useRef(0);
    const isAlertVisibleRef = useRef(false);

    const [alertCounts, setAlertCounts] = useState({
        gazeLeft: 0,
        gazeRight: 0,
        idle: 0,
        tabSwitch: 0,
        fullscreenExit: 0,
        multipleScreens: 0,
        backgroundNoise: 0,
        cheating: 0,
        absence: 0
    });

    const isProctoringEnabled = Object.values(alertCounts).every(count => count === 0);

    useEffect(() => {
        if (onStatusChange) {
            onStatusChange(isProctoringEnabled);
        }
    }, [alertCounts, onStatusChange]);

    const showAlert = (title, text, icon, alertType) => {
        if (isAlertVisibleRef.current) return;
        isAlertVisibleRef.current = true;

        setAlertCounts(prevCounts => ({
            ...prevCounts,
            [alertType]: prevCounts[alertType] + 1
        }));

        swal(title, text, icon).then(() => {
            isAlertVisibleRef.current = false;
        });
    };

    useEffect(() => {
      const requestPermissions = async () => {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
              webcamRef.current.srcObject = stream;
          } catch (error) {
              console.error("Permissions denied for webcam or microphone:", error);
          }
      };
  
      requestPermissions();
  
      runPosenet();
      monitorIdleTime();
      detectTabSwitching();
      detectFullscreenExit();
      startAudioMonitoring();
  
      return () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
          document.removeEventListener("fullscreenchange", handleFullscreenChange);
          
          // Stop camera and microphone permissions
          if (webcamRef.current?.srcObject) {
              webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
          }
  
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then(stream => {
                  stream.getTracks().forEach(track => track.stop());
              })
              .catch(error => console.error("Error stopping media stream:", error));
      };
  }, []);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            showAlert("Tab Change Detected!", "Please stay on the exam screen!", "error", "tabSwitch");
        }
    };

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            showAlert("Fullscreen Exited!", "Your answers might be reset!", "error", "fullscreenExit");
        }
    };

    const detectTabSwitching = () => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
    };

    const detectFullscreenExit = () => {
        document.addEventListener("fullscreenchange", handleFullscreenChange);
    };

    const runPosenet = async () => {
        try {
            const net = await posenet.load({
                architecture: "MobileNetV1",
                inputResolution: { width: 640, height: 480 },
                outputStride: 16
            });

            setInterval(() => detectPose(net), 1000);
        } catch (error) {
            console.error("Error loading PoseNet:", error);
        }
    };

    const detectPose = async (net) => {
        if (!webcamRef.current?.video || isAlertVisibleRef.current) return;

        const video = webcamRef.current.video;
        const pose = await net.estimateSinglePose(video, {
            flipHorizontal: false
        });

        const isPersonInFrame = pose.keypoints.some(keypoint => keypoint.score > 0.2);
        if (!isPersonInFrame) {
            absenceRef.current += 1;
            if (absenceRef.current >= 10) {
                showAlert("No person detected!", "Ensure you are in the frame.", "warning", "absence");
                absenceRef.current = 0;
            }
        } else {
            absenceRef.current = 0;
        }

        checkGazeDirection(pose.keypoints, 0.8);
    };

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
                if (gazeDirectionRef.current.time >= 10) {
                    showAlert("Possible cheating!", "You've been looking away for too long.", "error", "cheating");
                    gazeDirectionRef.current.time = 0;
                }
            } else {
                gazeDirectionRef.current.direction = newGazeDirection;
                gazeDirectionRef.current.time = 1;
            }
        } else {
            gazeDirectionRef.current.direction = null;
            gazeDirectionRef.current.time = 0;
        }
    };

    const monitorIdleTime = () => {
        const resetIdle = () => {
            idleRef.current = 0;
        };

        document.onmousemove = resetIdle;
        document.onkeypress = resetIdle;

        setInterval(() => {
            if (isAlertVisibleRef.current) return;
            idleRef.current += 1;
            if (idleRef.current > 60) {
                showAlert("Are you still there?", "You've been idle for too long!", "warning", "idle");
                idleRef.current = 0;
            }
        }, 1000);
    };

    const startAudioMonitoring = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 512;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            let ambientNoiseLevel = null;
            let lastNoiseAlertTime = 0;
            const noiseAlertThrottleTime = 100000; // 10 seconds

            setInterval(() => {
                analyser.getByteFrequencyData(dataArray);
                const averageVolume = dataArray.reduce((a, b) => a + b) / bufferLength;

                if (ambientNoiseLevel === null) {
                    ambientNoiseLevel = averageVolume;
                }

                const currentTime = Date.now();
                if (averageVolume > ambientNoiseLevel + 15 && (currentTime - lastNoiseAlertTime) > noiseAlertThrottleTime) {
                    showAlert("Background Noise Detected!", "Please stay in a quiet environment.", "error", "backgroundNoise");
                    lastNoiseAlertTime = currentTime;
                }
            }, 3000);
        });
    };

    return (
        <div>
            <Webcam ref={webcamRef} style={{ width: 100, height: 100 }} />
            <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
            {/* <div>
                <p>Alert Counts:</p>
                <ul>
                    {Object.entries(alertCounts).map(([key, value]) => (
                        <li key={key}>{key.replace(/([A-Z])/g, ' $1')}: {value}</li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
};
