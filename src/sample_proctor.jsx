// Proctoring Features Module

import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import DetectRTC from 'detectrtc';
import { Button } from '@material-ui/core';
import NetworkSpeed from 'network-speed';

// Instructions Component
export const Instructions = () => {
    const history = useHistory();
    function onAccept() {
        history.push('/formvalid');
    }

    // Disable Right click
    if (document.addEventListener) {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);
    }

    return (
        <div className="App-header">
            <center>
                <h2><b>Instructions To Follow:</b></h2>
            </center>
            <ul>
                <li>The lighting in the room must be bright enough to be considered “daylight” quality.</li>
                <li>Recommended to use the latest version of Chrome or Edge.</li>
                <li>Your Webcam should be on throughout the exam.</li>
                <li>Do not leave your seat during the exam.</li>
                <li>Do not wear hoodies, headphones, or hats.</li>
                <li>Do not speak to anyone during the exam.</li>
                <li>Do not escape fullscreen else answers will be reset!</li>
            </ul>
            <Button variant="contained" onClick={onAccept}>I Accept</Button>
        </div>
    );
};

// Dashboard Component
export const Dashboard = (props) => {
    const history = useHistory();
    const [minutes, setMinutes] = useState(sessionStorage.getItem("exam_timer"));
    const [seconds, setSeconds] = useState(sessionStorage.getItem("exam_sec") || 0);

    // Disable Right click
    if (document.addEventListener) {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);
    }

    // Alert on Tab Change
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            swal("Changed Tab Detected", "Action has been Recorded", "error");
        }
    });

    // Fullscreen Change Detection
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            history.push('/fullscreenalert');
        }
    });

    // Keypress Detection
    document.onkeydown = (event) => {
        if (event.altKey || event.ctrlKey) {
            swal('Keypress Detected');
            return false;
        }
        return true;
    };

    // Timer Logic
    useEffect(() => {
        const myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
                sessionStorage.setItem("exam_sec", seconds);
            } else if (minutes > 0) {
                setMinutes(minutes - 1);
                setSeconds(59);
                sessionStorage.setItem("exam_timer", minutes - 1);
            } else {
                clearInterval(myInterval);
            }
        }, 1000);
        return () => clearInterval(myInterval);
    }, [minutes, seconds]);

    return <div>Dashboard Component</div>;
};

// Posenet Component
export const Posenet = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const runPosenet = async () => {
        const net = await posenet.load({
            architecture: 'ResNet50',
            quantBytes: 2,
            inputResolution: { width: 640, height: 480 },
            scale: 0.6,
        });
        setInterval(() => detect(net), 500);
    };

    const detect = async (net) => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            const pose = await net.estimateSinglePose(video);
            EarsDetect(pose.keypoints, 0.8);
        }
    };

    const EarsDetect = (keypoints, minConfidence) => {
        const keypointEarR = keypoints[3];
        const keypointEarL = keypoints[4];

        if (keypointEarL.score < minConfidence) {
            swal("You looked away from the Screen (To the Right)");
        }
        if (keypointEarR.score < minConfidence) {
            swal("You looked away from the Screen (To the Left)");
        }
    };

    useEffect(() => { runPosenet(); }, []);

    return (
        <div>
            <Webcam ref={webcamRef} style={{ width: 640, height: 480 }} />
            <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
        </div>
    );
};

// System Check Component
export const SystemCheck = () => {
    const history = useHistory();
    const testNetworkSpeed = new NetworkSpeed();

    const getNetworkDownloadSpeed = async () => {
        const baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
        const fileSizeInBytes = 500000;
        const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
        sessionStorage.setItem("netspeed", speed.mbps);
    };

    useEffect(() => {
        getNetworkDownloadSpeed();
        ValidateCheck();
    }, []);

    const ValidateCheck = () => {
        let isAllowed = false;

        // Network Check
        const netSpeedVar = sessionStorage.getItem("netspeed");
        if (netSpeedVar > 2) {
            isAllowed = true;
        }

        // Browser Check
        if (DetectRTC.browser.isChrome && DetectRTC.browser.version > 80) {
            isAllowed = true;
        } else {
            swal("Please Update Browser or Try a Different Browser");
            isAllowed = false;
        }

        // Camera Permission
        DetectRTC.load(() => {
            const webcam = DetectRTC.isWebsiteHasWebcamPermissions;
            if (!webcam) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => { video.srcObject = stream; })
                    .catch(() => { swal("Camera access denied"); });
            }
        });

        if (!DetectRTC.isWebsiteHasWebcamPermissions) {
            swal("Enable Your Camera");
        }
    };

    return <div>System Check Component</div>;
};
