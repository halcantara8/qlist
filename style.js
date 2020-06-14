import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 0,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#191970',
        height: '100%'
    }
});