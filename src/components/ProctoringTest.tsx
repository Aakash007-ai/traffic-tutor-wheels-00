import React, { useEffect, useState } from "react";
import { ProctoringSystem } from "./Proctoring";

export const ProctorTestScreen = () => {
    const [isProctoringEnabled, setIsProctoringEnabled] = useState(false);
    useEffect(()=>{
        console.log("Proctoring enabled: -------------", isProctoringEnabled);
    },[isProctoringEnabled])
    return (
        <div>
            <h1>Online Exam</h1>
            <p>Please follow all proctoring guidelines.</p>
            <ProctoringSystem onStatusChange={setIsProctoringEnabled} />
        </div>
    );
};