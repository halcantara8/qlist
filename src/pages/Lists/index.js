import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, BackHandler, Animated, Modal, AsyncStorage, Alert, Keyboard } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import styles from './style';

import { useNavigation } from '@react-navigation/native';

export default function Lists() {
    const navigation = useNavigation();
    const [showForm, setShowForm] = useState(false);
    const [opBtn, setOpBtn] = useState(new Animated.Value(1));
    const [modalVisible, setModalVisible] = useState(false);
    const [texto, setTexto] = useState('');
    const [id, setId] = useState(null);
    const [filter, setFilter] = useState('');
    const [allList, setAllList] = useState([]);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inDetails, setInDetails] = useState(false);
    const [page, setPage] = useState(10);

    const _textInput = useRef(null);

    async function storeList(id = null) {
        if (texto == '') {
            return;
        }

        let order = 0;

        let key = null;
        let d = new Date();
        if (id != null) {
            key = id;
            let item = await AsyncStorage.getItem(id);
            item = JSON.parse(item);
            order = item.order;
        } else {
            key = "list_" + Date.now().toString();
            order = await AsyncStorage.getItem('order');
            order = order == null ? 1 : Number(order) + 1;
        }

        let list = {
            id: key,
            order: order,
            conteudo: texto,
            date: d.getDay() + '-' + d.getMonth() + '-' + d.getFullYear(),
            itens: [],
            status: false
        };

        await AsyncStorage.setItem(key, JSON.stringify(list));
        await AsyncStorage.setItem('order', order.toString());

        await slideDown();
        await loadList();
        await setTexto('');
        await setId(null);
        if (id == null) {
            await navigateToList(key, list.conteudo);
        }

    }

    async function editList(key) {
        let listInput = JSON.parse(await AsyncStorage.getItem(key));
        await setTexto(listInput.conteudo);
        await setId(listInput.id);
        await slideUp();
    }

    async function removeList(key) {
        await AsyncStorage.removeItem(key);
        await loadList();
    }

    async function loadList() {
        if (loading) {
            return;
        }

        await setLoading(true);
        const listKey = await AsyncStorage.getAllKeys();

        let showDoneT = await AsyncStorage.getItem('showListDone');
        showDoneT = JSON.parse(showDoneT);

        let dataLists = await AsyncStorage.multiGet(listKey);

        dataLists = dataLists.filter((array) => {
            array[1] = JSON.parse(array[1]);
            return array[1].id != null && array[1].id.includes('list_');
        });
        dataLists = dataLists.map((array) => {
            return array[1];
        });

        dataLists.sort((a, b) => { return b.order - a.order });

        await setLists(dataLists.slice(0, page));
        await setAllList(dataLists);
        await setLoading(false);
    }

    async function pagination() {
        await setPage(page + 4);
        let results = allList;
        if (filter != '') {
            results = lists;
        }
        results.slice(0, page);
        await setLists(results);
    }

    async function searchList(search) {
        let result = allList;
        if (search != '') {
            result = allList.filter((item) => {
                return item.conteudo.includes(search);
            });
        }
        result.slice(0, page);
        await setLists(result);
    }

    async function slideUp() {
        if (!showForm) {
            await setShowForm(true);
            setModalVisible(true);
            ShowButton();
        }
    }

    async function slideDown() {
        if (showForm) {
            setModalVisible(false);
            setShowForm(false);
            setTexto('');
            ShowButton();
            Keyboard.dismiss();
        }
    }

    async function ShowButton() {
        if (!showForm) {
            await Animated.timing(
                opBtn,
                {
                    toValue: 0,
                    duration: 200
                }
            ).start();
        } else {
            await Animated.timing(
                opBtn,
                {
                    toValue: 1,
                    duration: 200,
                    delay: 100
                }
            ).start();
        }
    }

    async function navigateToList(key, title) {
        await setInDetails(true);
        navigation.navigate('Details', { key, title });
    }

    function RightActions({ id }) {
        return (
            <View style={{ width: '45%', marginLeft: '-5%', height: 65, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#777' }}>
                <TouchableOpacity style={{ width: '50%', height: '100%', paddingLeft: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => removeList(id)}>
                    <FontAwesome name="trash" size={28} color="#FF8C00" />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => editList(id)}>
                    <FontAwesome name="pencil-square" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        );
    }

    function Item(item) {
        let { list } = item;
        let name = list.status ? 'check-square' : 'square-o';
        let { onSelect } = item;
        let op = list.status ? 0 : 'rgba(0, 100, 255, .7)';
        return useMemo(() => {
            return (
                <View style={styles.list}>
                    <TouchableOpacity activeOpacity={.8} style={{ backgroundColor: '#4682B4', width: '100%', borderRadius: 8, overflow: 'hidden'}} onPress={() => navigateToList(list.id, list.conteudo)} onLongPress={() => { Alert.alert('Toque para abrir a lista!'); }} >
                        <Swipeable childrenContainerStyle={{ backgroundColor: '#4682B4', paddingHorizontal: 30, borderRadius: 8, height: 65, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} renderRightActions={() => { return (<RightActions id={list.id} />) }}>
                            <Text style={styles.label} numberOfLines={1} >{list.conteudo}</Text>
                            <View style={{ marginRight: 10, }}>
                                <Octicons name='checklist' size={35} color="#fff" light/>
                            </View>
                        </Swipeable>
                    </TouchableOpacity>
                </View>
            );
        });
    }

    const onSelect = useRef(id => {
        setLists(oldData => {
            return [
                ...oldData.map(item => {
                    if (id === item.id) {
                        return {
                            ...item,
                            status: !item.status,
                        };
                    }
                    return item;
                }),
            ];
        });
    });

    const handleCloseApp = async () => {
        await setModalVisible(false);
        if (!showForm && !inDetails) {
            Alert.alert(
                'Atenção!',
                'Deseja realmente sair?', [{
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: () => BackHandler.exitApp()
                },], {
                cancelable: false
            }
            );
        } else {
            navigation.goBack();
            setInDetails(false);
        }
        return true;
    }

    BackHandler.addEventListener('hardwareBackPress', handleCloseApp);

    useEffect(() => {
        if (filter != '') {
            searchList(filter);
        } else {
            loadList();
        }
    }, [filter]);

    return (
        <View style={styles.container} onStartShouldSetResponder={slideDown}>
            <View style={styles.filter}>
                <FontAwesome name="search" size={20} color="#fffff5" />
                <TextInput value={filter} onChangeText={setFilter} onFocus={slideDown} style={styles.input} placeholder="Procurar lista" placeholderTextColor="#fffff5" />
            </View>
            <View style={{ width: '100%', paddingBottom: 0, height: '82%', borderRadius: 8, overflow: 'hidden' }}>
                <FlatList style={{ flex: 1, width: '100%' }}
                    data={lists}
                    onEndReachedThreshold={0.2}
                    onEndReached={pagination}
                    refreshing={loading}
                    onRefresh={() => { loadList }}
                    keyExtractor={list => String(list.id)}
                    renderItem={({ item: list }) => (
                        <Item list={list} onSelect={onSelect.current} />
                    )} />
            </View>
            <Animated.View
                style={{
                    width: '100%', opacity: opBtn,
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'flex-end', paddingVertical: 5,
                }}>
                <TouchableOpacity onPress={slideUp} style={[styles.add, { width: '40%', marginBottom: 20 }]} hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}>
                    <MaterialCommunityIcons name="playlist-plus" size={28} color="#FFF" />
                    <Text style={{ textAlign: 'center', marginBottom: 3, color: '#FFF', fontSize: 18 }} numberOfLines={1} >Nova lista</Text>
                </TouchableOpacity>
            </Animated.View>

            <Modal
                animationType="fade"
                visible={modalVisible}
                transparent={true}
                onShow={() => {
                    _textInput.current.focus();
                }}
                onRequestClose={() => slideDown()}
            >
                <View
                    style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, .5)', justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 10 }}>
                    <View style={styles.newList}>
                        <TextInput ref={_textInput} multiline={true} value={texto} onChangeText={setTexto} style={styles.inputAdd} placeholder="Nome da lista" placeholderTextColor="#777" />
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.cancelList} onPress={slideDown} hitSlop={{ top: 20, bottom: 20, left: 0, right: 20 }}>
                                <Text style={styles.cancelListLabel}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => storeList(id)} style={styles.submitList} hitSlop={{ top: 20, bottom: 20, left: 20, right: 0 }}>
                                <Text style={styles.submitListLabel}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
