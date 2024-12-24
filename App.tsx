import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { Accelerometer } from "expo-sensors";

export default function App() {
  const [{ x }, setAcceleration] = useState({ x: 0 });
  const [Status, setStatus] = useState(0);

  useEffect(() => {
    const subscription = Accelerometer.addListener(setAcceleration);
    // Accelerometer.setUpdateInterval(2000);
    (async () => {
      if (x > 0.8 && Status != 1) {
        setStatus(1);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      } else if (x < -0.8 && Status != 2) {
        setStatus(2);
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
      } else if (x < 0.8 && x > -0.8 && Status != 0) {
        setStatus(0); 
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
    })();
    return () => subscription.remove();
  }, [x, Status]);

 


  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text>teste posição da tela</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64
  },
  buttonCapture: {
    flex: 1,
    alignItems: "center",
    alignSelf: "flex-end",
    borderWidth: 5,
    borderColor: "white",
    height: 70,
    maxWidth: 70,
    borderRadius: 90,
    padding: 15
  },
  button: {
    flex: 1,
    height: 70,
    paddingTop: 18,
    paddingStart: 70,
    alignSelf: "flex-end",
    alignItems: "center"
  },
  button2: {
    flex: 1,
    height: 70,
    paddingTop: 18,
    paddingEnd: 70,
    alignSelf: "flex-end",
    alignItems: "center"
  }
});
