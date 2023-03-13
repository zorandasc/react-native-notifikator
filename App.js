import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import messagesApi from "./app/api/messages";
import MessagesList from "./app/components/messages/MessagesList";
import MessageModal from "./app/components/messages/MessageModal";
import useNotification from "./app/hooks/useNotification";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useNotification((notification) => {
    loadMessages();
  });

  function showMessageModal(id) {
    let newSelectedItem = messages.find((msg) => msg._id === id);
    setSelectedMessage(newSelectedItem);
    setModalVisible(true);
  }

  function closeMessageModal() {
    setModalVisible(false);
  }

  const deleteMessage = async (id) => {
    const orginalMessages = [...messages];
    setMessages((messages) => messages.filter((msg) => msg._id !== id));

    const response = await messagesApi.deleteMessage(id);
    if (!response.ok) {
      setMessages(orginalMessages);
    }
    setModalVisible(false);
  };

  const loadMessages = async () => {
    setLoading(true);
    const response = await messagesApi.getMessages();
    setLoading(false);

    if (!response.ok) return setError(response.problem);

    setError(false);
    setMessages(response.data);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMessages();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <>
      <StatusBar style="light"></StatusBar>
      <LinearGradient
        style={styles.rootScreen}
        colors={["#dea0c0", "#c7b068", "#793659", "#89a990", "#737ac7"]}
      >
        <ImageBackground
          source={require("./app/assets/images/bouq.jpg")}
          resizeMode="cover"
          style={styles.rootScreen}
          imageStyle={styles.backgroundImage}
        >
          <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Svadbeni Cvet Notifikator</Text>
            <MessageModal
              visible={modalVisible}
              selectedItem={selectedMessage}
              onCancel={closeMessageModal}
              onDelete={deleteMessage}
            ></MessageModal>
            <View style={styles.notificContainer}>
              <ActivityIndicator
                animating={loading}
                size="large"
                color="#4e0329"
              ></ActivityIndicator>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.textError}>
                    Greska u dobavljanu svadbenih poruka sa servera.{error}
                  </Text>
                  <View style={styles.buttonError}>
                    <Button
                      title="Retray"
                      onPress={loadMessages}
                      color="#7273c9"
                    ></Button>
                  </View>
                </View>
              ) : (
                !loading && (
                  <MessagesList
                    messages={messages}
                    onPressItem={showMessageModal}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  ></MessagesList>
                )
              )}
            </View>
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  rootScreen: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.55,
  },
  notificContainer: {
    paddingTop: 50,
    flex: 5,
  },
  header: {
    marginVertical: 12,
    backgroundColor: "#aa4d7b",
    textAlign: "center",
    paddingVertical: 12,
    fontSize: 18,
    color: "whitesmoke",
  },
  errorContainer: {
    marginVertical: 16,
    backgroundColor: "#333",
    opacity: 0.9,
  },
  textError: {
    color: "tomato",
    textAlign: "center",
    padding: 16,
  },
  buttonError: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
