import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BackButtom() {
    const navigator = useNavigation();
    
    function navigateBack(){
        navigator.goBack();
    }
    return(
        <TouchableOpacity onPress={navigateBack} style={{ flexDirection: 'row', marginLeft: 10, marginTop: -35, alignItems: 'center', justifyContent: 'center', paddingHorizontal:20 }}>
            <FontAwesome5 name="chevron-left" size={25} color="#999" />
        </TouchableOpacity>
    );
}
