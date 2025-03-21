import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import swal from "sweetalert";
import * as posenet from "@tensorflow-models/posenet";

export const ProctoringSystem = () => {
    const webcamRef = useRef(null);
    const [setupStep , setSetupStep] = useState(0);
    const canvasRef = useRef(null);
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

    useEffect(() => {
        runPosenet();
        monitorIdleTime();  
        detectTabSwitching();
        detectFullscreenExit();
        // checkMultipleMonitors();
        startAudioMonitoring();
    }, []);

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

    const runPosenet = async () => {
      console.log('runPosenet inside --> ', )
      try {
        const net = await posenet.load({
          architecture: "ResNet50",
          inputResolution: { width: 640, height: 480 },
          outputStride: 32
        })
      console.log('<--- net log --> ', net)

        setInterval(() => detectPose(net), 1000);
        
      } catch (error) {
        console.error("Error loading PoseNet:", error);
      }
      
    };

    const detectPose = async (net) => {
      console.log("Pose detecting --------------------");
        if (webcamRef.current?.video?.readyState === 4) {
            const video = webcamRef.current.video;
            const pose = await net.estimateSinglePose(video, {
              flipHorizontal: false
            });
            checkGazeDirection(pose.keypoints, 0.8);
        }
    };

    const checkGazeDirection = (keypoints, minConfidence) => {
        const keypointEarL = keypoints[3]; // Left ear
        const keypointEarR = keypoints[4]; // Right ear

        if (keypointEarL.score < minConfidence && !isAlertVisible) {
            showAlert("You looked away from the Screen (Right)", "Please stay focused!", "warning", "gazeRight");
        }
        if (keypointEarR.score < minConfidence && !isAlertVisible) {
            showAlert("You looked away from the Screen (Left)", "Please stay focused!", "warning", "gazeLeft");
        }
    };

    const monitorIdleTime = () => {
        let idleTime = 0;
        const resetIdle = () => {
            idleTime = 0;
            setIsIdle(false);
        };

        document.onmousemove = resetIdle;
        document.onkeypress = resetIdle;
        setInterval(() => {
            idleTime++;
            if (idleTime > 60 && !isAlertVisible) {
                setIsIdle(true);
                showAlert("Are you still there?", "You've been idle for too long!", "warning", "idle");
            }
        }, 1000);
    };

    const detectTabSwitching = () => {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden && !isAlertVisible) {
                showAlert("Tab Change Detected!", "Please stay on the exam screen!", "error", "tabSwitch");
            }
        });
    };

    const detectFullscreenExit = () => {
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement && !isAlertVisible) {
                showAlert("Fullscreen Exited!", "Your answers might be reset!", "error", "fullscreenExit");
            }
        });
    };

    const checkMultipleMonitors = () => {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(() => {
            if (!isAlertVisible) {
                showAlert("Multiple Screens Detected!", "Only use one screen.", "error", "multipleScreens");
            }
        }).catch(() => {});
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
            setInterval(() => {
                analyser.getByteFrequencyData(dataArray);
                const averageVolume = dataArray.reduce((a, b) => a + b) / bufferLength;
                if (averageVolume > 50 && !isAlertVisible) {
                    showAlert("Background Noise Detected!", "Please stay in a quiet environment.", "error", "backgroundNoise");
                }
            }, 3000);
        });
    };

    return (
        <div>
            <Webcam ref={webcamRef} style={{ width: 100, height: 100 }} />
            <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
            {isIdle && <p>You have been idle!</p>}
            <div>
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
            </div>
        </div>
    );
};