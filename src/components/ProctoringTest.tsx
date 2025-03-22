import React, { useEffect, useState } from "react";
import { ProctoringSystem } from "./Proctoring";

export const ProctorTestScreen = () => {
    const [isProctoringEnabled, setIsProctoringEnabled] = useState(true);
    useEffect(()=>{
        console.log("Proctoring enabled: -------------", isProctoringEnabled);
    },[isProctoringEnabled])
    return (
        <div>
            <h1>Online Exam</h1>
            <p>Please follow all proctoring guidelines.</p>
            <ProctoringSystem setIsProctoringEnabled={setIsProctoringEnabled} isGameStarted={true} />
        </div>
    );
};