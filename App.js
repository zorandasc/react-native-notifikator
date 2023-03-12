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
import { useEffect, useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";

import messagesApi from "./app/api/messages";
import expoPushTokensApi from "./app/api/expoPushTokens";
import MessagesList from "./app/components/messages/MessagesList";
import MessageModal from "./app/components/messages/MessageModal";
import Statusbar from "./app/components/Statusbar";

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
        sendToken(expoPushToken);
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync();

    //ON RECEIVING NOTIFICATION
    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {});

    //ON TOUCHING NOTIFICATION
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(loadMessages);

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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

  const sendToken = async (token) => {
    setLoading(true);
    const response = await expoPushTokensApi.register(token);
    //console.log(response.data);
    setLoading(false);

    setResponseStatus(response.status);
  };

  const loadMessages = async () => {
    setLoading(true);
    const response = await messagesApi.getMessages();
    setLoading(false);

    if (!response.ok) return setError(response.problem);

    setError(false);
    setMessages(response.data);
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
                  ></MessagesList>
                )
              )}
            </View>
            <Statusbar
              onPress={registerForPushNotificationsAsync}
              status={responseStatus}
            ></Statusbar>
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
