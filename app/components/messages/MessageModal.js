import React from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import AppButton from "../AppButton";

function MessageModal(props) {
  if (!props.selectedItem) return;
  let { _id, dateTime, name, email, content } = props.selectedItem;
  return (
    <Modal visible={props.visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.textInput}>
            Datum: <Text style={styles.text}>{dateTime}</Text>
          </Text>
          <Text style={styles.textInput}>
            Ime: <Text style={styles.text}>{name}</Text>
          </Text>
          <Text style={styles.textInput}>
            Email: <Text style={styles.text}>{email}</Text>
          </Text>
          <Text style={styles.textInput}>
            Poruka: <Text style={styles.text}>{content}</Text>
          </Text>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <AppButton
                title="Obrisi"
                onPress={props.onDelete.bind(this, _id)}
                color="#995678"
              >
                <FontAwesome name="trash-o" size={28} color="whitesmoke" />
              </AppButton>
            </View>
            <View style={styles.button}>
              <AppButton
                title="Zatvori"
                onPress={props.onCancel}
                color="#9596d3"
              >
                <MaterialCommunityIcons
                  name="exit-to-app"
                  size={28}
                  color="whitesmoke"
                />
              </AppButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  itemContainer: {
    padding: 16,
    width: "100%",
    backgroundColor: "whitesmoke",
    opacity: 0.95,
    elevation: 16,
    borderRadius: 6,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  textInput: {
    color: "whitesmoke",
    borderBottomColor: "#222",
    borderBottomWidth: 1,
    borderRadius: 6,
    width: "100%",
    padding: 16,
    color: "#222",
    fontStyle: "italic",
  },
  text: {
    fontWeight: "bold",
    color: "#222",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingTop: 16,
    //width: "100%",
    //padding: 16,
  },
  button: {
    width: 150,
    marginHorizontal: 8,
  },
});

export default MessageModal;
