import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Movies = ({ navigation: { navigate } }) => (
  <TouchableOpacity
    onPress={() => navigate("Stack", { screen: "one" })}
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <Text>Movies</Text>
  </TouchableOpacity>
);
export default Movies;

