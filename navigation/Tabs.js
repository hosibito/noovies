import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "../screens/Movies";
import Tv from "../screens/Tv";
import Search from "../screens/Search";
import { Text, View } from "react-native";

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: { backgroundColor: "#4a47ff" },
      tabBarActiveTintColor: "#1eff00",
      tabBarInactiveTintColor: "#c307fc",
      headerTitleStyle: { color: "#f53513" },
      headerRight: () => (
        <View>
          <Text>Hello</Text>
        </View>
      ),
    }}
  >
    <Tab.Screen name="Movies" component={Movies} />
    <Tab.Screen name="Tv" component={Tv} options={{tabBarStyle: {backgroundColor: "#ffd105"},}} />
    <Tab.Screen name="Search" component={Search} options={{tabBarBadge: 5}}/>
  </Tab.Navigator>
);

export default Tabs;

