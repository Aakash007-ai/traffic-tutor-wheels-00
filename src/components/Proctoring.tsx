import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import swal from "sweetalert";
import * as posenet from "@tensorflow-models/posenet";

export const ProctoringSystem = ({ onStatusChange, isGameStarted }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const absenceRef = useRef(0);
    const gazeDirectionRef = useRef({ direction: null, time: 0 });
    const idleRef = useRef(0);
    const isAlertVisibleRef = useRef(false);
    const poseDetectionInterval = useRef(null);

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

    useEffect(() => {
        console.log("Proctoring -------------", isGameStarted);
    }, [isGameStarted]);

    useEffect(() => {
        if (onStatusChange) {
            onStatusChange(Object.values(alertCounts).every(count => count === 0));
        }
    }, [alertCounts, onStatusChange]);

    const showAlert = useCallback((title, text, icon, alertType) => {
        if (!isGameStarted || isAlertVisibleRef.current) return; // Prevent alerts if game is not started

        isAlertVisibleRef.current = true;
        setAlertCounts(prevCounts => ({
            ...prevCounts,
            [alertType]: prevCounts[alertType] + 1
        }));

        swal(title, text, icon).then(() => {
            isAlertVisibleRef.current = false;
        });
    }, [isGameStarted]);

    const handleVisibilityChange = useCallback(() => {
        if (!isGameStarted) return;
        if (document.hidden) {
            showAlert("Tab Change Detected!", "Please stay on the exam screen!", "error", "tabSwitch");
        }
    }, [showAlert, isGameStarted]);

    const handleFullscreenChange = useCallback(() => {
        if (!isGameStarted) return;
        if (!document.fullscreenElement) {
            showAlert("Fullscreen Exited!", "Your answers might be reset!", "error", "fullscreenExit");
        }
    }, [showAlert, isGameStarted]);

    useEffect(() => {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [handleVisibilityChange, handleFullscreenChange]);

    const detectPose = async (net) => {
        if (!webcamRef.current?.video || !isGameStarted || isAlertVisibleRef.current) return;

        const video = webcamRef.current.video;
        const pose = await net.estimateSinglePose(video, { flipHorizontal: false });
        
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
        if (!isGameStarted) return;
        
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
                if (gazeDirectionRef.current.time >= 5) {
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
            if (!isGameStarted || isAlertVisibleRef.current) return;
            idleRef.current += 1;
            if (idleRef.current > 60) {
                showAlert("Are you still there?", "You've been idle for too long!", "warning", "idle");
                idleRef.current = 0;
            }
        }, 1000);
    };

    return (
        <div>
            <Webcam ref={webcamRef} style={{ width: 100, height: 100 }} />
            <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
        </div>
    );
};