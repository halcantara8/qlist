import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, AsyncStorage, Alert, Keyboard } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import styles from './style';
import BackButtom from '../../components/BackButtom';



export default function Details({ navigation }) {
    const route = useRoute();
    const idList = route.params.key;
    navigation.setOptions({
        headerLeft: () => (
            <BackButtom />
        ),
        title: route.params.title
    });
    const [itemText, setItemText] = useState('');
    const [dataItens, setDataItens] = useState([]);
    const [filter, setFilter] = useState('');
    const [allItens, setAllItens] = useState([]);
    const [iconSubmit, setIconSubmit] = useState('plus');
    const [loading, setLoading] = useState(false);
    const [opacityAnim, setOpacityAnim] = useState(1);
    const [page, setPage] = useState(10);
    const [idItem, setIdItem] = useState('');
    const idInput = useRef(null);

    async function storeItem() {
        if (itemText == '') {
            return;
        }
        await setOpacityAnim(.5);

        let list = await AsyncStorage.getItem(idList);
        list = JSON.parse(list);

        if (idItem != '') {
            await list.itens.map((item) => {
                if (item.id == idItem) {
                    item.conteudo = itemText;
                }
            });

            await setIdItem('');
            await setIconSubmit('plus');
            idInput.current.blur();

        } else {
            let order = await AsyncStorage.getItem('orderItem');
            order = order == null ? 1 : Number(order) + 1;

            let item = {
                id: "i_" + Date.now().toString(),
                order: order,
                conteudo: itemText,
                status: false,
            };

            list.itens.push(item);

            await AsyncStorage.setItem('orderItem', order.toString());
        }


        await AsyncStorage.setItem(idList, JSON.stringify(list));

        await setItemText('');

        await loadaItens();

    }

    async function loadaItens() {
        if (loading) {
            return;
        }

        await setLoading(true);

        let list = await AsyncStorage.getItem(idList);
        list = JSON.parse(list);
        list.itens.sort((a, b) => { return b.order - a.order });
        list.itens.sort((a, b) => { return a.status - b.status });

        await setDataItens(list.itens);
        await setAllItens(list.itens);
        await setLoading(false);
        await setOpacityAnim(1);
    }

    async function pagination() {
        await setPage(page + 4);
        let results = allItens;
        if (filter != '') {
            results = dataItens;
        }
        results.slice(0, page);
        await setDataItens(results);
    }

    async function searchItem(search) {
        if (loading) {
            return;
        }

        await setLoading(true);
        let result = allItens;
        if (search != '') {
            result = allItens.filter((item) => {
                return item.conteudo.includes(search);
            });
        }
        result.slice(0, page);
        await setDataItens(result);
        await setLoading(false);
    }

    async function doneItem(key) {
        let list = await AsyncStorage.getItem(idList);
        list = JSON.parse(list);

        list.itens.map((item) => {
            if (item.id == key) {
                item.status = !item.status;
            }
        });

        await AsyncStorage.setItem(idList, JSON.stringify(list));
        await loadaItens();
    }

    async function deleteItem(key) {
        let list = await AsyncStorage.getItem(idList);
        list = JSON.parse(list);

        list.itens = list.itens.filter((item) => {
            return item.id != key;
        });

        await AsyncStorage.setItem(idList, JSON.stringify(list));

        await loadaItens();
    }

    async function editItem(key) {
        await setIconSubmit('edit');
        let list = await AsyncStorage.getItem(idList);
        list = JSON.parse(list);

        let item = list.itens.filter((item) => {
            return item.id == key;
        });
        await setIdItem(item[0].id);
        await setItemText(item[0].conteudo);
        idInput.current.focus();
    }

    function cancelEdit() {
        setIconSubmit('plus');
        setItemText('');
    }

    Keyboard.addListener('keyboardDidHide', () => {
        cancelEdit();
    });

    function Item(data) {
        let { item } = data;
        let name = item.status ? 'check-square' : 'square-o';
        let textThrough = item.status ? 'line-through' : 'none';
        let { onSelect } = data;
        let color = item.status ? '#1E90FF' : '#1E90FF99';
        let txt = item.status ? '#ccc' : '#111';
        return useMemo(() => {
            return (
                <TouchableOpacity
                    style={[styles.item, { height: 50, borderWidth: 1, borderColor: '#999' }]}
                    onPress={() => editItem(item.id)} onLongPress={() => { Alert.alert('Toque para editar!'); }} >

                    <Text style={[styles.label, { width: '67%', color: txt, textDecorationLine: textThrough }]} numberOfLines={1} >{item.conteudo}</Text>

                    <TouchableOpacity style={{ width: '15%', padding: 10 }} onPress={() => deleteItem(item.id)}>
                        <FontAwesome name='trash' size={28} color='#FF8C00' />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '15%', padding: 10 }} onPress={() => { onSelect(item.id); doneItem(item.id); }}>
                        <FontAwesome name={name} size={28} color={color} />
                    </TouchableOpacity>

                </TouchableOpacity>
            );
        });
    }

    const onSelect = useRef(id => {
        setDataItens(oldData => {
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

    useEffect(() => {
        loadaItens();
    }, []);

    useEffect(() => {
        if (filter != '') {
            searchItem(filter);
        } else {
            loadaItens();
        }
    }, [filter]);

    return (
        <View style={styles.container}>
            <View style={[styles.filter, { marginTop: 10 }]}>
                <FontAwesome name="search" size={20} color="#fffff5" />
                <TextInput value={filter} onChangeText={setFilter} style={styles.input} placeholder="Procurar item" placeholderTextColor="#ccc" />
            </View>
            <FlatList style={{ width: '100%', flexGrow: 0 }}
                data={dataItens}
                onEndReachedThreshold={0.2}
                onEndReached={pagination}
                refreshing={loading}
                onRefresh={() => { loadaItens }}
                keyExtractor={data => String(data.id)}
                renderItem={({ item: data }) => (
                    <Item item={data} onSelect={onSelect.current} />
                )} />
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'flex-start',
                    alignSelf: 'flex-start',
                    backgroundColor: '#fff', paddingBottom: 5,
                    height: 70, position: 'absolute', bottom: 0, alignSelf: 'center'
                }}>
                <View style={{ 
                    width: '80%', paddingVertical: 10,
                    borderTopLeftRadius: 8, borderBottomLeftRadius: 8,
                    backgroundColor: '#FFF', borderWidth: 1,
                    borderColor: '#20B2AA', 
                    }}>
                    <TextInput
                        ref={idInput}
                        value={itemText}
                        onChangeText={setItemText}
                        multiline={true}
                        style={[styles.input, { padding: 2, width: '100%', color: '#111', opacity: opacityAnim,  }]}
                        placeholder="Insira um item"
                        placeholderTextColor="#ccc"
                        selectionColor='#000'
                        onBlur={cancelEdit}
                    />
                </View>
                <TouchableOpacity onPress={storeItem}
                    style={[styles.add, {
                        width: '20%', paddingVertical: 12.5,
                        borderTopRightRadius: 8, borderBottomRightRadius: 8,
                        borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
                        justifyContent: 'center',
                    }]}
                    hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}>
                    <Feather name={iconSubmit} size={28} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}