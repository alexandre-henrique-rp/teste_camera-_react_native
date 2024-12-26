import React, { useState } from "react";
import Rotation from "./src/component/Rotation";
import CameraComponent from "./src/component/Camera";
import FaceOutline from "./src/component/FaceOutline";


export default function App() {
  const [OrientationStatus, setOrientationStatus] = useState(0);
  return (
    <Rotation Orientation={(value: any) => setOrientationStatus(value)}>
     <CameraComponent OrientationStatus={OrientationStatus}/>
     <FaceOutline />
    </Rotation>
  );
}
