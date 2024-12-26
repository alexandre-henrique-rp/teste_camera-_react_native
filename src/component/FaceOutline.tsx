import React from "react";
import { StyleSheet, View } from "react-native";

export default function FaceOutline() {
  return <View style={styles.faceOutline} />;
}

const styles = StyleSheet.create({
  faceOutline: {
    position: "absolute",
    top: "47%", // Centraliza verticalmente
    left: "50%", // Centraliza horizontalmente
    transform: [{ translateX: -85 }, { translateY: -150 }], // Ajusta para o centro
    width: 190, // Largura do contorno
    height: 290, // Altura do contorno
    borderWidth: 4, // Espessura do contorno
    borderColor: "rgba(255, 255, 255, 0.8)", // Cor do contorno
    borderRadius: 100, // Torna o contorno oval
    zIndex: 9999, // Garante que fique acima de outros elementos
    pointerEvents: "none", // Evita interferência em cliques
  },
});
