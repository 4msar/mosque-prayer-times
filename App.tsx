import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import MosqueDetailsScreen from './src/screens/MosqueDetailsScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" id={undefined}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Nearby Mosques' }}
        />
        <Stack.Screen
          name="MosqueDetails"
          component={MosqueDetailsScreen}
          options={({ route }) => ({ title: route.params.name || 'Mosque Details' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
