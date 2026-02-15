import { Tabs } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { theme } from '../theme';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colorCerulean }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shopping List',
          tabBarIcon: ({ size, color }) => {
            return <Feather name="list" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="counter"
        options={{
          title: 'Counter',
          headerShown: false,
          tabBarIcon: ({ size, color }) => {
            return <AntDesign name="clock-circle" size={size} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="idea"
        options={{
          title: 'Idea',
          tabBarIcon: ({ size, color }) => {
            return <FontAwesome5 name="lightbulb" size={size} color={color} />;
          },
        }}
      />
    </Tabs>
  );
}
