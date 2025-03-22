import React, { forwardRef, useState, useImperativeHandle, useRef, useEffect } from 'react';
import './RoadComponent.css';
import QuizController, { QuizControllerRef } from '../QuizController/QuizController';
import { getImage } from '../QuizController/QuizControllerImage';
import GameStats from '../GameStats/GameStats';
import Sound from '../sound';


export interface IRoadComponentProp {
    direction?: 'left' | 'right' | 'up' | 'down';
    right?: boolean;
}

// Define the exposed methods for ref
export interface RoadComponentRef {
    turnLeft: (keyUp: boolean) => void;
    turnRight: (keyUp: boolean) => void;
}
const rightPos = 100;
const NEXT_QUIZ_TIME = 5000;

// Ref-enabled RoadComponent
const RoadComponent = forwardRef<RoadComponentRef, IRoadComponentProp>(({ right = false }, ref) => {
    const showPole = useRef(false);
    const gameStatsRef = useRef(null);
    const audioRef = useRef(null);
    const quizControllerRef = useRef<QuizControllerRef>(null);

    const mainState = useRef({
        canvas: null,
        ctx: null,
        canvas2: null,
        ctx2: null,
        signCanvas: null,
        signCtx: null,
        colors: {
            sky: "#D4F5FE",
            mountains: "#83CACE",
            ground: "#8FC04C",
            groundDark: "#73B043",
            road: "#606a7c",
            roadLine: "#FFF",
            hud: "#FFF"
        },
        settings: {
            fps: 60,
            skySize: 120,
            ground: {
                size: 350,
                min: 4,
                max: 120
            },
            road: {
                min: 76,
                max: 1000,
            }
        },
        state: {
            bgpos: 0,
            offset: 0,
            startDark: true,
            curve: 0,
            currentCurve: 0,
            turn: 1,
            speed: 7,
            xpos: 0,
            section: 50,
            poleY: 70,
            car: {
                maxSpeed: 7,
                friction: 0.4,
                acc: 0.85,
                deAcc: 0.5
            },
            keypress: {
                up: false,
                left: false,
                right: false,
                down: false
            },
            poleImage: new Image(),
            isImageLoaded: false
        },
        storage: {
            bg: null
        }
    });

    const reset = () => {
        showPole.current = false;
        mainState.current.state.poleY = 70;
        // drawBg();
        draw();
        keyDown({ keyCode: 999, preventDefault: () => { } });
        setTimeout(() => {
            showPole.current = true;
        }, NEXT_QUIZ_TIME);
    };

    useEffect(() => {
        setTimeout(() => {
            showPole.current = true;
        }, NEXT_QUIZ_TIME);
    }, []);

    useEffect(() => {
        mainState.current.canvas = document.getElementsByTagName('canvas')[0];
        mainState.current.ctx = mainState.current.canvas.getContext('2d');
        mainState.current.canvas2 = document.createElement('canvas');
        mainState.current.canvas2.width = mainState.current.canvas.width;
        mainState.current.canvas2.height = mainState.current.canvas.height;
        mainState.current.ctx2 = mainState.current.canvas2.getContext('2d');
        mainState.current.signCanvas = document.createElement('canvas');
        mainState.current.signCanvas.width = mainState.current.canvas.width;
        mainState.current.signCanvas.height = mainState.current.canvas.height;
        mainState.current.signCtx = mainState.current.signCanvas.getContext('2d');
        window.addEventListener("keydown", keyDown, false);
        window.addEventListener("keyup", keyUp, false);
        mainState.current.signCtx.fillStyle = "green";
        mainState.current.signCtx.fillRect(100, 10, 40, 100);
        drawBg();
        draw();


    }, []);

    useImperativeHandle(ref, () => ({
        turnLeft: (releaseKey) => {
            if (releaseKey) {
                keyUp({ keyCode: 37, preventDefault: () => { } });
            } else {
                keyDown({ keyCode: 37, preventDefault: () => { } });
            }
        },
        turnRight: (releaseKey) => {
            if (releaseKey) {
                keyUp({ keyCode: 39, preventDefault: () => { } });
            } else {
                keyDown({ keyCode: 39, preventDefault: () => { } });
            }
        },
    }));

    function draw() {
        setTimeout(function () {
            const perspectiveFactor = (mainState.current.state.poleY - 70) / (320 - 70);
            if (showPole.current && perspectiveFactor > 0.95) {
                quizControllerRef.current.loadNext();
                console.log("true")
                return;
            }
            calcMovement();

            //if(mainState.current.state.speed > 0) {
            mainState.current.state.bgpos += (mainState.current.state.currentCurve * 0.02) * (mainState.current.state.speed * 0.2);
            mainState.current.state.bgpos = mainState.current.state.bgpos % mainState.current.canvas.width;

            mainState.current.ctx.putImageData(mainState.current.storage.bg, mainState.current.state.bgpos, 5);
            mainState.current.ctx.putImageData(mainState.current.storage.bg, mainState.current.state.bgpos > 0 ? mainState.current.state.bgpos - mainState.current.canvas.width : mainState.current.state.bgpos + mainState.current.canvas.width, 5);
            //}

            mainState.current.state.offset += mainState.current.state.speed * 0.05;
            if (mainState.current.state.offset > mainState.current.settings.ground.min) {
                mainState.current.state.offset = mainState.current.settings.ground.min - mainState.current.state.offset;
                mainState.current.state.startDark = !mainState.current.state.startDark;
            }
            drawGround(mainState.current.ctx, mainState.current.state.offset, mainState.current.colors.ground, mainState.current.colors.groundDark, mainState.current.canvas.width);

            drawRoad(mainState.current.settings.road.min + 6, mainState.current.settings.road.max + 36, 10, mainState.current.colors.roadLine);
            drawGround(mainState.current.ctx2, mainState.current.state.offset, mainState.current.colors.roadLine, mainState.current.colors.road, mainState.current.canvas.width);
            drawRoad(mainState.current.settings.road.min, mainState.current.settings.road.max, 10, mainState.current.colors.road);
            drawRoad(3, 24, 0, mainState.current.ctx.createPattern(mainState.current.canvas2, 'repeat'));
            drawCar();
            if (showPole.current) drawPole(mainState.current.ctx, mainState.current.ctx.createPattern(mainState.current.canvas2, 'repeat'));
            //drawHUD(mainState.current.ctx, 630, 340, mainState.current.colors.hud);

            requestAnimationFrame(draw);
        }, 1000 / mainState.current.settings.fps);
    }

    function drawPole(ctx, pos) {
        const min = 3, max = 3;
        const basePos = mainState.current.canvas.width + mainState.current.state.xpos;

        const perspectiveFactor = (mainState.current.state.poleY - 70) / (320 - 70);
        const startX = ((basePos + min) / 2) - (mainState.current.state.currentCurve * 3) - 80;
        const centerX = mainState.current.canvas.width / 2;
        const xPos = startX + 30 + (right ? rightPos : 0);

        if (mainState.current.state.speed > 0) {
            mainState.current.state.poleY += mainState.current.state.speed * 0.5;
        }

        if (mainState.current.state.poleY > 320) {
            mainState.current.state.poleY = 70;
        }

        if (mainState.current.state.poleY < 320) {
            const scale = 0.5 + (perspectiveFactor * 0.8);

            const baseCircleSize = 20;
            const basePoleWidth = 5;
            const basePoleHeight = 50;

            const circleSize = baseCircleSize * scale;
            const poleWidth = basePoleWidth * scale;
            const poleHeight = basePoleHeight * scale;

            // Draw pole
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillRect(xPos, 120 - poleHeight, poleWidth, poleHeight);

            // Draw circle background
            ctx.beginPath();
            ctx.arc(xPos + 1, 120 - poleHeight, circleSize, 0, 2 * Math.PI);
            ctx.fillStyle = "orange";
            ctx.fill();

            // Draw image inside circle if loaded
            if (mainState.current.state.isImageLoaded) {
                ctx.save(); // Save the current context state

                // Create circular clipping path
                ctx.beginPath();
                ctx.arc(xPos + 1, 120 - poleHeight, circleSize * 0.9, 0, 2 * Math.PI);
                ctx.clip();

                // Calculate image dimensions to maintain aspect ratio
                const imageSize = circleSize * 1.8;
                const imageX = xPos + 1 - imageSize / 2;
                const imageY = 120 - poleHeight - imageSize / 2;

                // Draw the image
                ctx.drawImage(
                    mainState.current.state.poleImage,
                    imageX,
                    imageY,
                    imageSize,
                    imageSize
                );

                ctx.restore(); // Restore the context state
            }
        }
    }

    function drawHUD(ctx, centerX, centerY, color) {
        const radius = 50, tigs = [0, 90, 135, 180, 225, 270, 315];

        let angle = 90;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 7;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();

        for (let i = 0; i < tigs.length; i++) {
            drawTig(ctx, centerX, centerY, radius, tigs[i], 7);
        }

        // draw pointer
        angle = map(mainState.current.state.speed, 0, mainState.current.state.car.maxSpeed, 90, 360);
        drawPointer(ctx, color, 50, centerX, centerY, angle);
    }

    function drawPointer(ctx, color, radius, centerX, centerY, angle) {
        const point = getCirclePoint(centerX, centerY, radius - 20, angle),
            point2 = getCirclePoint(centerX, centerY, 2, angle + 90),
            point3 = getCirclePoint(centerX, centerY, 2, angle - 90);

        ctx.beginPath();
        ctx.strokeStyle = "#FF9166";
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;
        ctx.moveTo(point2.x, point2.y);
        ctx.lineTo(point.x, point.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, 9, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function drawTig(ctx, x, y, radius, angle, size) {
        const startPoint = getCirclePoint(x, y, radius - 4, angle),
            endPoint = getCirclePoint(x, y, radius - size, angle)

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
    }

    function getCirclePoint(x, y, radius, angle) {
        const radian = (angle / 180) * Math.PI;

        return {
            x: x + radius * Math.cos(radian),
            y: y + radius * Math.sin(radian)
        }
    }

    function calcMovement() {
        const move = mainState.current.state.speed * 0.01;
        let newCurve = 0;

        if (mainState.current.state.keypress.up) {
            mainState.current.state.speed += mainState.current.state.car.acc - (mainState.current.state.speed * 0.015);
        } else if (mainState.current.state.speed > 0) {
            mainState.current.state.speed -= mainState.current.state.car.friction;
        }

        if (mainState.current.state.keypress.down && mainState.current.state.speed > 0) {
            mainState.current.state.speed -= 1;
        }

        // Left and right
        mainState.current.state.xpos -= (mainState.current.state.currentCurve * mainState.current.state.speed) * 0.005;

        if (mainState.current.state.speed) {
            if (mainState.current.state.keypress.left) {
                mainState.current.state.xpos += (Math.abs(mainState.current.state.turn) + 7 + (mainState.current.state.speed > mainState.current.state.car.maxSpeed / 4 ? (mainState.current.state.car.maxSpeed - (mainState.current.state.speed / 2)) : mainState.current.state.speed)) * 0.4;
                mainState.current.state.turn -= 2;
            }

            if (mainState.current.state.keypress.right) {
                mainState.current.state.xpos -= (Math.abs(mainState.current.state.turn) + 7 + (mainState.current.state.speed > mainState.current.state.car.maxSpeed / 4 ? (mainState.current.state.car.maxSpeed - (mainState.current.state.speed / 2)) : mainState.current.state.speed)) * 0.4;
                mainState.current.state.turn += 2;
            }

            if (mainState.current.state.turn !== 0 && !mainState.current.state.keypress.left && !mainState.current.state.keypress.right) {
                mainState.current.state.turn += mainState.current.state.turn > 0 ? -0.25 : 0.25;
            }
        }

        mainState.current.state.turn = clamp(mainState.current.state.turn, -5, 5);
        mainState.current.state.speed = clamp(mainState.current.state.speed, 0, mainState.current.state.car.maxSpeed);

        // section
        mainState.current.state.section -= mainState.current.state.speed;

        if (mainState.current.state.section < 0) {
            mainState.current.state.section = randomRange(1000, 9000);

            newCurve = randomRange(-50, 50);

            if (Math.abs(mainState.current.state.curve - newCurve) < 20) {
                newCurve = randomRange(-50, 50);
            }

            mainState.current.state.curve = newCurve;
        }

        if (mainState.current.state.currentCurve < mainState.current.state.curve && move < Math.abs(mainState.current.state.currentCurve - mainState.current.state.curve)) {
            mainState.current.state.currentCurve += move;
        } else if (mainState.current.state.currentCurve > mainState.current.state.curve && move < Math.abs(mainState.current.state.currentCurve - mainState.current.state.curve)) {
            mainState.current.state.currentCurve -= move;
        }

        if (Math.abs(mainState.current.state.xpos) > 450) {
            mainState.current.state.speed = 0; // park car
        }

        mainState.current.state.xpos = clamp(mainState.current.state.xpos, -550, 550);
    }

    function keyUp(e) {
        move(e, false);
    }

    function keyDown(e) {
        move(e, true);
    }

    function move(e, isKeyDown) {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            e.preventDefault();
        }

        if (e.keyCode === 37) {
            mainState.current.state.keypress.left = isKeyDown;
        }

        if (e.keyCode === 999) {
            mainState.current.state.keypress.up = isKeyDown;
        }

        if (e.keyCode === 39) {
            mainState.current.state.keypress.right = isKeyDown;
        }

        if (e.keyCode === 990) {
            mainState.current.state.keypress.down = isKeyDown;
        }
    }

    function randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    function norm(value, min, max) {
        return (value - min) / (max - min);
    }

    function lerp(norm, min, max) {
        return (max - min) * norm + min;
    }

    function map(value, sourceMin, sourceMax, destMin, destMax) {
        return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function drawBg() {
        mainState.current.ctx.fillStyle = mainState.current.colors.sky;
        mainState.current.ctx.fillRect(0, 0, mainState.current.canvas.width, mainState.current.settings.skySize);
        drawMountain(0, 60, 200);
        drawMountain(280, 40, 200);
        drawMountain(400, 80, 200);
        drawMountain(550, 60, 200);


        mainState.current.storage.bg = mainState.current.ctx.getImageData(0, 0, mainState.current.canvas.width, mainState.current.canvas.height);
    }

    function drawMountain(pos, height, width) {
        mainState.current.ctx.fillStyle = mainState.current.colors.mountains;
        mainState.current.ctx.strokeStyle = mainState.current.colors.mountains;
        mainState.current.ctx.lineJoin = "round";
        mainState.current.ctx.lineWidth = 20;
        mainState.current.ctx.beginPath();
        mainState.current.ctx.moveTo(pos, mainState.current.settings.skySize);
        mainState.current.ctx.lineTo(pos + (width / 2), mainState.current.settings.skySize - height);
        mainState.current.ctx.lineTo(pos + width, mainState.current.settings.skySize);
        mainState.current.ctx.closePath();
        mainState.current.ctx.stroke();
        mainState.current.ctx.fill();
    }

    function drawSky() {
        mainState.current.ctx.fillStyle = mainState.current.colors.sky;
        mainState.current.ctx.fillRect(0, 0, mainState.current.canvas.width, mainState.current.settings.skySize);
    }

    function drawRoad(min, max, squishFactor, color) {
        const basePos = mainState.current.canvas.width + mainState.current.state.xpos;

        mainState.current.ctx.fillStyle = color;
        mainState.current.ctx.beginPath();
        mainState.current.ctx.moveTo(((basePos + min) / 2) - (mainState.current.state.currentCurve * 3), mainState.current.settings.skySize);
        mainState.current.ctx.quadraticCurveTo((((basePos / 2) + min)) + (mainState.current.state.currentCurve / 3) + squishFactor, mainState.current.settings.skySize + 52, (basePos + max) / 2, mainState.current.canvas.height);
        mainState.current.ctx.lineTo((basePos - max) / 2, mainState.current.canvas.height);
        mainState.current.ctx.quadraticCurveTo((((basePos / 2) - min)) + (mainState.current.state.currentCurve / 3) - squishFactor, mainState.current.settings.skySize + 52, ((basePos - min) / 2) - (mainState.current.state.currentCurve * 3), mainState.current.settings.skySize);
        mainState.current.ctx.closePath();
        mainState.current.ctx.fill();
    }

    function drawCar() {
        const carWidth = 160,
            carHeight = 50,
            carX = (mainState.current.canvas.width / 2) - (carWidth / 2),
            carY = 320;

        // shadow
        roundedRect(mainState.current.ctx, "rgba(0, 0, 0, 0.35)", carX - 1 + mainState.current.state.turn, carY + (carHeight - 35), carWidth + 10, carHeight, 9);

        // tires
        roundedRect(mainState.current.ctx, "#111", carX, carY + (carHeight - 30), 30, 40, 6);
        roundedRect(mainState.current.ctx, "#111", (carX - 22) + carWidth, carY + (carHeight - 30), 30, 40, 6);

        drawCarBody(mainState.current.ctx);
    }

    function drawCarBody(ctx) {
        const startX = 299, startY = 311,
            lights = [10, 26, 134, 152];
        let lightsY = 0;

        /* Front */
        roundedRect(mainState.current.ctx, "#C2C2C2", startX + 6 + (mainState.current.state.turn * 1.1), startY - 18, 146, 40, 18);

        ctx.beginPath();
        ctx.lineWidth = "12";
        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#FFFFFF";
        ctx.moveTo(startX + 30, startY);
        ctx.lineTo(startX + 46 + mainState.current.state.turn, startY - 25);
        ctx.lineTo(startX + 114 + mainState.current.state.turn, startY - 25);
        ctx.lineTo(startX + 130, startY);
        ctx.fill();
        ctx.stroke();
        /* END: Front */

        ctx.lineWidth = "12";
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.fillStyle = "#DEE0E2";
        ctx.strokeStyle = "#DEE0E2";
        ctx.moveTo(startX + 2, startY + 12 + (mainState.current.state.turn * 0.2));
        ctx.lineTo(startX + 159, startY + 12 + (mainState.current.state.turn * 0.2));
        ctx.quadraticCurveTo(startX + 166, startY + 35, startX + 159, startY + 55 + (mainState.current.state.turn * 0.2));
        ctx.lineTo(startX + 2, startY + 55 - (mainState.current.state.turn * 0.2));
        ctx.quadraticCurveTo(startX - 5, startY + 32, startX + 2, startY + 12 - (mainState.current.state.turn * 0.2));
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = "12";
        ctx.fillStyle = "#DEE0E2";
        ctx.strokeStyle = "#DEE0E2";
        ctx.moveTo(startX + 30, startY);
        ctx.lineTo(startX + 40 + (mainState.current.state.turn * 0.7), startY - 15);
        ctx.lineTo(startX + 120 + (mainState.current.state.turn * 0.7), startY - 15);
        ctx.lineTo(startX + 130, startY);
        ctx.fill();
        ctx.stroke();

        roundedRect(ctx, "#474747", startX - 4, startY, 169, 10, 3, true, 0.2);
        roundedRect(ctx, "#474747", startX + 40, startY + 5, 80, 10, 5, true, 0.1);

        ctx.fillStyle = "#FF9166";

        lights.forEach(function (xPos) {
            ctx.beginPath();
            ctx.arc(startX + xPos, startY + 20 + lightsY, 6, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            lightsY += mainState.current.state.turn * 0.05;
        });

        ctx.lineWidth = "9";
        ctx.fillStyle = "#222222";
        ctx.strokeStyle = "#444";

        roundedRect(mainState.current.ctx, "#FFF", startX + 60, startY + 25, 40, 18, 3, true, 0.05);
    }

    function roundedRect(ctx, color, x, y, width, height, radius, turn, turneffect) {
        const skew = turn === true ? mainState.current.state.turn * turneffect : 0;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x + radius, y - skew);

        // top right
        ctx.lineTo(x + width - radius, y + skew);
        ctx.arcTo(x + width, y + skew, x + width, y + radius + skew, radius);
        ctx.lineTo(x + width, y + radius + skew);

        // down right
        ctx.lineTo(x + width, (y + height + skew) - radius);
        ctx.arcTo(x + width, y + height + skew, (x + width) - radius, y + height + skew, radius);
        ctx.lineTo((x + width) - radius, y + height + skew);

        // down left
        ctx.lineTo(x + radius, y + height - skew);
        ctx.arcTo(x, y + height - skew, x, (y + height - skew) - radius, radius);
        ctx.lineTo(x, (y + height - skew) - radius);

        // top left
        ctx.lineTo(x, y + radius - skew);
        ctx.arcTo(x, y - skew, x + radius, y - skew, radius);
        ctx.lineTo(x + radius, y - skew);
        ctx.fill();
    }

    function drawGround(ctx, offset, lightColor, darkColor, width) {
        let pos = (mainState.current.settings.skySize - mainState.current.settings.ground.min) + offset, stepSize = 1, drawDark = mainState.current.state.startDark, firstRow = true;
        ctx.fillStyle = lightColor;
        ctx.fillRect(0, mainState.current.settings.skySize, width, mainState.current.settings.ground.size);

        ctx.fillStyle = darkColor;
        while (pos <= mainState.current.canvas.height) {
            stepSize = norm(pos, mainState.current.settings.skySize, mainState.current.canvas.height) * mainState.current.settings.ground.max;
            if (stepSize < mainState.current.settings.ground.min) {
                stepSize = mainState.current.settings.ground.min;
            }

            if (drawDark) {
                if (firstRow) {
                    ctx.fillRect(0, mainState.current.settings.skySize, width, stepSize - (offset > mainState.current.settings.ground.min ? mainState.current.settings.ground.min : mainState.current.settings.ground.min - offset));
                } else {
                    ctx.fillRect(0, pos < mainState.current.settings.skySize ? mainState.current.settings.skySize : pos, width, stepSize);
                }
            }

            firstRow = false;
            pos += stepSize;
            drawDark = !drawDark;
        }

    }

    return (
        <>
        <Sound ref={audioRef}/>
            <GameStats ref={gameStatsRef} onGameOver={() => { 
                quizControllerRef.current?.onGameOver();
                audioRef?.current?.pause();
                }} />
            <div className={'bodyDiv'}>

                <canvas id="myCanvas" height="450" width="750"></canvas>

                <QuizController
                    ref={quizControllerRef}
                    onRestart={() => {
                        audioRef?.current?.play();
                        reset();
                    }}
                    onSubmit={(isCorrect, score) => {
                        reset();
                        gameStatsRef?.current?.setStats(isCorrect, score)
                    }}
                    onQuestionLoad={(quiz) => {
                        // Update the pole image URL
                        mainState.current.state.poleImage.src = getImage(quiz.metadata.imageFile);
                        mainState.current.state.poleImage.onload = () => {
                            mainState.current.state.isImageLoaded = true;
                        };
                    }}
                />

            </div>
        </>

    );
});

export default RoadComponent;
