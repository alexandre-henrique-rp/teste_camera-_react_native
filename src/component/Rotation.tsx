import * as ScreenOrientation from "expo-screen-orientation";
import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type RotationProps = {
  children: React.ReactNode;
  Orientation: any;
};

export default function Rotation({ children, Orientation }: RotationProps) {
  const [{ x }, setAcceleration] = useState({ x: 0 });
  const [Status, setStatus] = useState(0);

  useEffect(() => {
    const subscription = Accelerometer.addListener(setAcceleration);
    Accelerometer.setUpdateInterval(800);
    const DistincPlataform = Platform.OS == "ios" ? 1 : 2;

    (async () => {
      if (x > 0.8) {
        setStatus(1);
        Orientation(1);
        if (DistincPlataform == 1) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
          );
        } else  {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
          );
        }
      }
      if (x < -0.8) {
        setStatus(2);
        Orientation(2);

        if (DistincPlataform == 1) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
          );
        } else  {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
          );
        }
      }
      if (x < 0.8 && x > -0.8) {
        setStatus(0);
        Orientation(0);
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      }
      // console.log(Platform.OS);
    })();
    return () => subscription.remove();
  }, [x]);

  return (
    <View style={styles.container}>
      {/* <Text style={{ fontSize: 20, marginTop: 40 }}>{x.toFixed(2)}</Text> */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
    // alignItems: "center"
  }
});
