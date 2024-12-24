import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions
} from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Sharing from 'expo-sharing';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function App() {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const CanRef = useRef<null | any>(null);

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }

  async function deviceOrientation() {
    const status = await ScreenOrientation.getPlatformOrientationLockAsync();
    console.log(status);
  }

  useEffect(() => {
    requestPermission();
    requestMicPermission();
    if (recording) {
      const interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    // changeScreenOrientation();
    deviceOrientation();

  }, [recording, requestPermission, requestMicPermission]);

  if (!permission || !micPermission) {
    return null;
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }
  async function startCapture() {
    if (!CanRef.current) return;

    setRecording(true);
    try {
      const video = await CanRef.current.recordAsync({
        maxDuration: 15
      });
      setRecording(false);
      setTime(0);
      console.log("Video captured", video);
      // salvar video em algum lugar
      setVideoUri(video.uri);
    } catch (error) {
      console.error("Error recording video:", error);
    }
  }

  async function stopCapture() {
    setRecording(false);
    if (CanRef.current) {
      try {
        await CanRef.current.stopRecording();
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  }

  async function shareVideo() {
    if (!videoUri) {
      Alert.alert("Erro", "Nenhum vídeo disponível para compartilhar");
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert("Erro", "Compartilhamento não está disponível neste dispositivo");
        return;
      }

      await Sharing.shareAsync(videoUri, {
        mimeType: 'video/mp4',
        dialogTitle: 'Compartilhar vídeo',
        UTI: 'public.movie'  // necessário para iOS
      });
    } catch (error) {
      console.error("Error sharing video:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o vídeo");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CameraView
        style={styles.camera}
        facing={facing}
        mode={"video"}
        ref={CanRef}
        ratio="16:9"
        videoQuality="1080p"
      >
        <View style={styles.buttonContainer}>
        <TouchableOpacity 
            style={styles.button2}
            onPress={shareVideo}
            disabled={!videoUri}
          >
            <FontAwesome 
              name="share" 
              size={30} 
              color={videoUri ? "white" : "gray"} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonCapture}
            onPress={recording ? stopCapture : startCapture}
            disabled={recording}
          >
            {recording ? (
              <Text style={{ color: "white", fontSize: 20 }}>{time}</Text>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <FontAwesome name="refresh" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
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
