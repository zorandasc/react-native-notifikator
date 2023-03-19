import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

function Counter({ loading }) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    loading ? setTimeout(() => setCounter(counter + 1), 1000) : setCounter(0);
  }, [counter, loading]);

  return (
    <View style={styles.container}>
      {loading && <Text style={styles.text}>Waiting for server... {counter}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 24,
    color: "whitesmoke",
  },
});

export default Counter;
