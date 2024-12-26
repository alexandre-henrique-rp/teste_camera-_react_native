import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions
} from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Sharing from "expo-sharing";
import * as ScreenOrientation from "expo-screen-orientation";

type CameraComponentProps = {
  OrientationStatus: number;
};

export default function CameraComponent({
  OrientationStatus
}: CameraComponentProps) {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const [statusVideo, setStatusVideo] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const Duration = 15;
  const [time, setTime] = useState(Duration);
  const CanRef = useRef<null | any>(null);
  useEffect(() => {
    requestPermission();
    requestMicPermission();
    if (recording) {
      const interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
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
        maxDuration: Duration
      });
      setRecording(false);
      setTime(0);
      console.log("Video captured", video);
      // salvar video em algum lugar
      setVideoUri(video.uri);
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
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
        Alert.alert(
          "Erro",
          "Compartilhamento não está disponível neste dispositivo"
        );
        return;
      }

      await Sharing.shareAsync(videoUri, {
        mimeType: "video/mp4",
        dialogTitle: "Compartilhar vídeo",
        UTI: "public.movie" // necessário para iOS
      });
    } catch (error) {
      console.error("Error sharing video:", error);
      Alert.alert("Erro", "Não foi possível compartilhar o vídeo");
    }
  }

  return (
    <CameraView
      style={styles.camera}
      facing={facing}
      mode={"video"}
      ref={CanRef}
      ratio="16:9"
      videoQuality="1080p"
    >
      <View style={styles.buttonContainer}>
        {videoUri ? (
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
        ) : (
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
        )}
        {OrientationStatus == 1 || OrientationStatus === 2 ? (
          <TouchableOpacity
            style={styles.buttonCapture}
            onPress={recording ? stopCapture : startCapture}
            disabled={recording}
          >
            {recording ? (
              <Text style={{ color: "white", fontSize: 20 }}>{time}</Text>
            ) : null}
          </TouchableOpacity>
        ) : null}
        {OrientationStatus == 1 || OrientationStatus === 2 ? (
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <FontAwesome name="refresh" size={30} color="white" />
          </TouchableOpacity>
        ) : null}
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 5
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
