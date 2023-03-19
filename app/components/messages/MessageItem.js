import React from "react";
import { View, StyleSheet, Text, Pressable, Image } from "react-native";
import { Fontisto, Feather } from "@expo/vector-icons";

function MessageItem({ item, onPress }) {
  //console.log(item);
  return (
    <Pressable
      android_ripple={{ color: "#aa4d7b" }}
      onPress={onPress.bind(this, item._id)}
    >
      <View style={styles.itemCard}>
        <Image
          source={require("../../assets/images/iconbouq.png")}
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <View style={styles.cardBody}>
          <Text style={styles.date}>{item.dateTime}</Text>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemText}>{item.email}</Text>
        </View>
        <View>
          {item.touched ? (
            <Feather name="gift" size={24} color="black" />
          ) : (
            <Fontisto name="bell-alt" size={24} color="#aa4d7b" />
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    margin: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: "whitesmoke",
    opacity: 0.85,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 16,
    shadowColor: "#000",
  },

  cardBody: { alignItems: "center", flex: 1 },

  itemText: {
    paddingVertical: 2,
    color: "#222",
    fontWeight: "bold",
  },
  date: {
    paddingVertical: 2,
    color: "#444",
    fontStyle: "italic",
  },
});

export default MessageItem;
