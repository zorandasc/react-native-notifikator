import React from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import MessageItem from "./MessageItem";

function MessagesList({ messages, onPressItem, refreshing, onRefresh }) {
  return (
    <>
      {!messages || messages.length == 0 ? (
        <View>
          <Text style={styles.text}>Nema notifikacija u aplikaciji</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={(itemData, index) => {
            return (
              <MessageItem
                item={itemData.item}
                onPress={onPressItem}
                key={index}
              ></MessageItem>
            );
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        ></FlatList>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: {
    color: "whitesmoke",
    textAlign: "center",
  },
});

export default MessagesList;
