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
        backgroundNoise: 0,
        gazeAway: 0,
        cheating: 0,
        absence: 0
    }); 

    const [gazeDirectionTime, setGazeDirectionTime] = useState(0);
    const gazeDirectionThreshold = 10; // seconds
    const [currentGazeDirection, setCurrentGazeDirection] = useState(null);
    const [absenceTime, setAbsenceTime] = useState(0);
    const absenceThreshold = 10; // seconds

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
        if (isAlertVisible) return;
        console.log('runPosenet inside --> ', )
        try {
            const net = await posenet.load({
                architecture: "ResNet50",
                inputResolution: { width: 640, height: 480 },
                outputStride: 32,
                // multiplier: 0.50
            })
            console.log('<--- net log --> ', net)

            setInterval(() => detectPose(net), 1000);
            
        } catch (error) {
            console.error("Error loading PoseNet:", error);
        }
        
    };

    const detectPose = async (net) => {
        if (isAlertVisible) return;
        console.log("Pose detecting --------------------");
        if (webcamRef.current?.video?.readyState === 4) {
            const video = webcamRef.current.video;
            const pose = await net.estimateSinglePose(video, {
                flipHorizontal: false
            });
            console.log('pose --> ', pose);

            const isPersonInFrame = pose.keypoints.some(keypoint => keypoint.score > 0.2); // Lowered threshold to detect more keypoints
            if (!isPersonInFrame) {
                setAbsenceTime(prevTime => prevTime + 1);
                if (absenceTime >= absenceThreshold && !isAlertVisible) {
                    showAlert("No person detected!", "Please ensure you are in the frame.", "warning", "absence");
                    setAbsenceTime(0); // Reset the timer after showing alert
                }
            } else {
                setAbsenceTime(0); // Reset if person is detected
            }

            checkGazeDirection(pose.keypoints, 0.8);
        }
    };

    const checkGazeDirection = (keypoints, minConfidence) => {
        const keypointEarL = keypoints[3]; // Left ear
        const keypointEarR = keypoints[4]; // Right ear

        let newGazeDirection = null;
        if (keypointEarL.score < minConfidence) {
            newGazeDirection = "right";
        } else if (keypointEarR.score < minConfidence) {
            newGazeDirection = "left";
        }

        if (newGazeDirection) {
            if (currentGazeDirection === newGazeDirection) {
                setGazeDirectionTime(prevTime => prevTime + 1);
                if (gazeDirectionTime >= gazeDirectionThreshold && !isAlertVisible) {
                    showAlert("Possible cheating detected!", "You've been looking in one direction for too long.", "error", "cheating");
                    setGazeDirectionTime(0); // Reset the timer after showing alert
                }
            } else {
                setCurrentGazeDirection(newGazeDirection);
                setGazeDirectionTime(1); // Start counting for the new direction
            }
        } else {
            setCurrentGazeDirection(null);
            setGazeDirectionTime(0); // Reset if user is looking at the screen
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
            if (isAlertVisible) return;
            idleTime++;
            if (idleTime > 60 && !isAlertVisible) {
                setIsIdle(true);
                showAlert("Are you still there?", "You've been idle for too long!", "warning", "idle");
            }
        }, 1000);
    };

    const detectTabSwitching = () => {
        document.addEventListener("visibilitychange", () => {
            if (isAlertVisible) return;
            if (document.hidden && !isAlertVisible) {
                showAlert("Tab Change Detected!", "Please stay on the exam screen!", "error", "tabSwitch");
            }
        });
    };

    const detectFullscreenExit = () => {
        document.addEventListener("fullscreenchange", () => {
            if (isAlertVisible) return;
            if (!document.fullscreenElement && !isAlertVisible) {
                showAlert("Fullscreen Exited!", "Your answers might be reset!", "error", "fullscreenExit");
            }
        });
    };

    const checkMultipleMonitors = () => {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(() => {
            if (isAlertVisible) return;
            if (!isAlertVisible) {
                showAlert("Multiple Screens Detected!", "Only use one screen.", "error", "multipleScreens");
            }
        }).catch(() => {});
    };

    const startAudioMonitoring = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            if (isAlertVisible) return;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 512;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            setInterval(() => {
                if (isAlertVisible) return;
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
                    <li>Cheating: {alertCounts.cheating}</li>
                    <li>Absence: {alertCounts.absence}</li>
                </ul>
            </div>
        </div>
    );
};