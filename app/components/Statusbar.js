import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function Statusbar({ onPress, status }) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#4f8e93" }}
      style={styles.container}
    >
      <View>
        {status === 201 ? (
          <AntDesign name="checkcircle" size={26} color="#4f8e93" />
        ) : (
          <AntDesign name="close" size={26} color="tomato" />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    margin: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#333",
    elevation: 16,
  },
});

export default Statusbar;
