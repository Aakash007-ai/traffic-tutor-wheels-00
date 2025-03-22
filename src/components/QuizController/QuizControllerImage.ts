
import compulsoryTurnLeft from "../../assets/signs/compulsoryTurnLeft.png";
import endOfSpeedRestriction from "../../assets/signs/endOfSpeedRestriction.png";
import giveWay from "../../assets/signs/giveWay.png";
import guardedLevelCross from "../../assets/signs/guardedLevelCross.png";
import oneWay from "../../assets/signs/oneWay.png";
import parkingOnTheRightAllowed from "../../assets/signs/parkingOnTheRightAllowed.png";
import pedestrianCrossing from "../../assets/signs/pedestrianCrossing.png";
import redLight from "../../assets/signs/redLight.png";
import rightTurnProhibited from "../../assets/signs/rightTurnProhibited.png";
import stop from "../../assets/signs/stop.png";
import zebraLines from "../../assets/signs/zebraLines.png";

const signImages = {
    "compulsoryTurnLeft.png": compulsoryTurnLeft,
    "endOfSpeedRestriction.png": endOfSpeedRestriction,
    "giveWay.png": giveWay,
    "guardedLevelCross.png": guardedLevelCross,
    "oneWay.png": oneWay,
    "parkingOnTheRightAllowed.png": parkingOnTheRightAllowed,
    "pedestrianCrossing.png": pedestrianCrossing,
    "redLight.png": redLight,
    "rightTurnProhibited.png": rightTurnProhibited,
    "stop.png": stop,
    "zebraLines.png": zebraLines,
  };

  export function getImage(fileName: string) {
    return signImages[fileName];

  }