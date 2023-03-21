import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";

import expoPushTokens from "../api/expoPushTokens";

//TIPICNO SE PUSH TOKEN CUVA U BAZI ZA SVAKI TELEFON

//ovim mobilni telefon detektuje, prikazuje notifikaciju
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
});

export default useNotification = (notificationHandler) => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => await expoPushTokens.register(token))
      .catch((error) => alert(error));

    //ON RECEIVING NOTIFICATION
    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {});

    //ON TOUCHING NOTIFICATION
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        notificationHandler
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
};

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
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error("Dozvola za primanje notifikacija nije omogućena!");
      //alert("Failed to get push token for push notification!");
      //return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    throw new Error("Must use physical device for Push Notifications");
    //alert("Must use physical device for Push Notifications");
  }
  return token;
}
