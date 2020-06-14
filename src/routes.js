import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';

import Lists from './pages/Lists';
import Details from './pages/Lists/details';

const Apptack = createStackNavigator();

export default function Routes() {
  const optionsNavigator = {
    headerTitleStyle: {
      textAlign: 'center',
      color: '#fff',
      fontSize: 25,
      height: 70
    },
    headerStyle: {
      backgroundColor: '#191970',
      height: 50
    },
    headerTitleAlign: 'center',
    gesturesEnabled: false,
  }
  return (
    <NavigationContainer >
      <Apptack.Navigator screenOptions={optionsNavigator} initialRouteName='Listas' >
        <Apptack.Screen name="Listas" component={Lists} options={({ navigation, route }) => ({})} />
        <Apptack.Screen name="Details" component={Details} options={{
          title: 'Details',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }} />
      </Apptack.Navigator>

    </NavigationContainer>
  );
}