import React from "react";
import { StyleSheet, Pressable } from "react-native";

const AppButton = ({ onPress, color, children }) => {
  return (
    <Pressable
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    width: "100%",
    marginVertical: 10,
    elevation: 5,
  }
});

export default AppButton;
