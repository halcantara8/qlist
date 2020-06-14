import React from 'react';
import { StatusBar, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import Routes from './src/routes';
import styles from './style';


export default function App() {  
  StatusBar.setBarStyle('default');
  StatusBar.setBackgroundColor('#191970');
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding', android: 'f', })}>
          <Routes/>
      </KeyboardAvoidingView>  
    </SafeAreaView>  
  );
}