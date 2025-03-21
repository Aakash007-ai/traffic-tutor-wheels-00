import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import swal from "sweetalert";
import * as posenet from "@tensorflow-models/posenet";

export const ProctoringSystem = () => {
    const webcamRef = useRef(null);
    const [setupStep , setSetupStep] = useState(0);
    const canvasRef = useRef(null);
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        runPosenet();
        monitorIdleTime();  
        detectTabSwitching();
        detectFullscreenExit();
        // checkMultipleMonitors();
        startAudioMonitoring();
    }, []);

    // Load PoseNet for gaze tracking
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

    // Detect if user looks away
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

        if (keypointEarL.score < minConfidence) {
            swal("You looked away from the Screen (Right)", "Please stay focused!", "warning");
        }
        if (keypointEarR.score < minConfidence) {
            swal("You looked away from the Screen (Left)", "Please stay focused!", "warning");
        }
    };

    // Idle Detection
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
            if (idleTime > 60) {
                setIsIdle(true);
                swal("Are you still there?", "You've been idle for too long!", "warning");
            }
        }, 1000);
    };

    // Detect Tab Switching
    const detectTabSwitching = () => {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                swal("Tab Change Detected!", "Please stay on the exam screen!", "error");
            }
        });
    };

    // Detect Fullscreen Exit
    const detectFullscreenExit = () => {
        document.addEventListener("fullscreenchange", () => {
            if (!document.fullscreenElement) {
                swal("Fullscreen Exited!", "Your answers might be reset!", "error");
            }
        });
    };

    // Detect Multiple Monitors
    const checkMultipleMonitors = () => {
        navigator.mediaDevices.getDisplayMedia({ video: true }).then(() => {
            swal("Multiple Screens Detected!", "Only use one screen.", "error");
        }).catch(() => {});
    };

    // Audio Monitoring for Background Noise
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
                if (averageVolume > 50) {
                    swal("Background Noise Detected!", "Please stay in a quiet environment.", "error");
                }
            }, 3000);
        });
    };

    return (
        <div>
            <Webcam ref={webcamRef} style={{ width: 640, height: 480 }} />
            <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
            {isIdle && <p>You have been idle!</p>}
        </div>
    );
};