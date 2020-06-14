import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        height: '100%'

    },

    filter:{
        backgroundColor: "rgba(0, 0, 0, .4)",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        overflow: 'hidden',        
        width: '100%',
        borderWidth: 1,
        borderColor: '#fff'
    },

    input:{
        marginLeft: 10,
        width: '100%',
        paddingRight: 30,
        fontSize: 18,
        color: '#fff'
    },

    list:{ 
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 5
    },
    item:{        
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 5
    },

    label:{
        fontSize: 20,
        marginLeft: 10, 
        color: '#fff',
        width: '100%'
    },

    add:{       
        backgroundColor: '#20B2AA',
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 25, 
        width: '48%',
        flexDirection: 'row',
        borderRadius: 5,      
    },

    arquivo:{
        backgroundColor: '#444',
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 25, 
        width: '48%',
        flexDirection: 'row',
        borderRadius: 5
    },
    
    newList: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        overflow: 'hidden',        
        width: '100%',
        minHeight: 120,   
        maxHeight: 220,         
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    
    inputAdd:{
        marginLeft: 10,
        width: '100%',
        fontSize: 18,
        color: '#000',         
        maxHeight: 130, 
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#777',
        marginBottom: 30
    },

    submitList:{
        backgroundColor: '#20B2AA',
        width: 100,
        padding: 5,   
        borderRadius: 8, 
        marginTop: 20,
        marginRight: 10
    },  

    submitListLabel:{
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
    },  

    cancelList:{
        backgroundColor: '#FF4500',
        width: 100,
        padding: 5,   
        borderRadius: 8, 
        marginTop: 20,
        marginRight: 10
    },    

    cancelListLabel:{
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
    }
});