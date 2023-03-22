import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
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
import Counter from "./app/components/Counter";
import AppButton from "./app/components/AppButton";
import useApiWrapper from "./app/hooks/useApiWrapper";

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: messages,
    setData: setMessages,
    error,
    loading,
    request: loadMessages,
  } = useApiWrapper(messagesApi.getMessages);

  //ON EVERY STARTUP TWO REQUEST GO TO OUR NODE SERVER, SIMLTANIUSLY.
  //THIS await expoPushTokens.register(token) IF GRANTED
  useNotification((notification) => {
    loadMessages();
  });

  //AND THIS messagesApi.getMessages()
  //THIS HAS NO RESTRICTION ABOUT AUTHORITY
  useEffect(() => {
    loadMessages();
  }, []);

  //on press list item
  function showMessageModal(id) {
    let newSelectedItem = messages.find((msg) => msg._id === id);
    setSelectedMessage(newSelectedItem);

    setModalVisible(true);

    //AKO PORTUKA NIJE TOUCHOVANA NIKAD A SAD JE SELEKTOVANA
    //PROMJENI touched STATUS
    if (!newSelectedItem.touched) {
      touchMessage(id);
    }
  }

  function closeMessageModal() {
    setModalVisible(false);
  }

  const deleteMessage = async (id) => {
    const orginalMessages = [...messages];

    //LOKALNA PROMJENA
    const changedMessages = messages.filter((msg) => msg._id !== id);
    setMessages(changedMessages);

    //PROMJENA NA SERVERU
    const response = await messagesApi.deleteMessage(id);
    if (!response.ok) setMessages(orginalMessages);

    setModalVisible(false);
  };

  const touchMessage = async (id) => {
    const orginalMessages = [...messages];

    //LOKALNA PROMJENA
    const changedMessages = messages.map((message) => {
      if (message._id === id) message.touched = true;
      return message;
    });
    setMessages(changedMessages);

    //PROMJENA NA SERVERU
    const response = await messagesApi.touchMessage(id);
    if (!response.ok) setMessages(orginalMessages); //VRATI NA STARO AKO FAIL
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMessages();
    setRefreshing(false);
  };

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
            <Counter loading={loading}></Counter>
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
                color="whitesmoke"
              ></ActivityIndicator>

              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.textError}>
                    Greška u dobavljanju svadbenih poruka sa servera. {error}
                  </Text>
                  <View style={styles.buttonError}>
                    <AppButton
                      title="Retray"
                      onPress={loadMessages}
                      color="#7273c9"
                    >
                      <Text style={{ color: "whitesmoke" }}>
                        Pokušajte ponovo
                      </Text>
                    </AppButton>
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
    backgroundColor: "#be6a94",
    textAlign: "center",
    paddingVertical: 12,
    fontSize: 18,
    color: "whitesmoke",
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 2,
    borderColor: "whitesmoke",
  },
  errorContainer: {
    marginVertical: 16,
    backgroundColor: "#333",
    opacity: 0.9,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  textError: {
    color: "#ec8dbc",
    textAlign: "center",
    padding: 16,
  },
  buttonError: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
