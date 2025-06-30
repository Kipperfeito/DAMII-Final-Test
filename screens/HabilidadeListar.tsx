import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, FlatList, Modal } from 'react-native';
import estilo from "../estilo";
import { auth, firestore } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Personagem } from '../model/Personagem';
import { Habilidade } from '../model/Habilidade';

export default function HabilidadeManter() {
    const navigation = useNavigation();
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const [personagemSelecionado, setPersonagemSelecionado] = useState<Personagem | null>(null);
    const [personagens, setPersonagens] = useState<Personagem[]>([]);
    const [habilidades, setHabilidades] = useState<Habilidade[]>([]);

    const [formHabilidade, setFormHabilidade] = useState<Partial<Habilidade>>({
        nome: '',
        dano: '0',
        custoMana: '0',
        nivel: '1',
    });

    useEffect(() => {
        if (!modalVisible) return;

        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const unsubscribe = firestore
            .collection('Usuario')
            .doc(uid)
            .collection('Personagem')
            .onSnapshot(querySnapshot => {
                const lista: Personagem[] = [];
                querySnapshot.forEach(doc => {
                    lista.push(new Personagem({ id: doc.id, ...doc.data() } as Personagem));
                });
                setPersonagens(lista);
            }, error => {
                console.log('Erro ao buscar personagens:', error);
            });

        return () => unsubscribe();
    }, [modalVisible]);
    useEffect(() => {
        if (!personagemSelecionado) return;

        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const unsubscribe = firestore
            .collection('Usuario')
            .doc(uid)
            .collection('Personagem')
            .doc(personagemSelecionado.id)
            .collection('Habilidade')
            .onSnapshot(snapshot => {
                const lista: Habilidade[] = [];
                snapshot.forEach(doc => {
                    lista.push(new Habilidade({ id: doc.id, ...doc.data() } as Habilidade));
                });
                setHabilidades(lista);
            }, error => {
                console.log('Erro ao buscar habilidades:', error);
            });

        return () => unsubscribe();
    }, [personagemSelecionado]);

    const salvar = async () => {
        if (!personagemSelecionado.id) {
            Alert.alert("Erro", "Personagem não definido");
            return;
        }

        if (!formHabilidade.nome || formHabilidade.nome.trim() === '') {
            Alert.alert("Erro", "Nome da habilidade é obrigatório");
            return;
        }

        try {
            const uid = auth.currentUser?.uid;
            if (!uid) {
                Alert.alert("Erro", "Usuário não autenticado");
                return;
            }

            var refHabilidade;
            if (formHabilidade.id) {
                // atualizar habilidade existente
                refHabilidade = firestore
                    .collection("Usuario").doc(uid)
                    .collection("Personagem").doc(personagemSelecionado.id)
                    .collection("Habilidade").doc(formHabilidade.id);

                await refHabilidade.update(formHabilidade);
                Alert.alert("Sucesso", "Habilidade atualizada");
            } else {
                // criar nova habilidade
                refHabilidade = firestore
                    .collection("Usuario").doc(uid)
                    .collection("Personagem").doc(personagemSelecionado.id)
                    .collection("Habilidade").doc();

                formHabilidade.id = refHabilidade.id;

                await refHabilidade.set(formHabilidade);
                Alert.alert("Sucesso", "Habilidade cadastrada");
            }

            setFormHabilidade({ nome: '', dano: '0', custoMana: '0', nivel: '1' });
            navigation.goBack();

        } catch (error: any) {
            Alert.alert("Erro", error.message || "Falha ao salvar habilidade");
        }
    };
    const selecionarPersonagem = (personagem: Personagem) => {
        setModalVisible(false);
        setPersonagemSelecionado(personagem);
    };

    const limpar = () => {
        setFormHabilidade({ nome: '', dano: '0', custoMana: '0', nivel: '1' });
    };
    const renderItem = ({ item }: { item: Personagem }) => (
        <TouchableOpacity
            style={estilo.itemContainer}
            onPress={() => selecionarPersonagem(item)}
        >
            <Text style={estilo.itemText}>{item.nome}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={estilo.container}>
            <View style={estilo.inputContainer}>
                {personagemSelecionado && (
                    <Text style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 16 }}>
                        Personagem selecionado: {personagemSelecionado.nome}
                    </Text>
                )}
                <TouchableOpacity
                    style={estilo.button}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={estilo.buttonText}>Selecionar Personagem</Text>
                </TouchableOpacity>
                {personagemSelecionado && (
                    <>
                        <Text style={{ fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>Habilidades do Personagem:</Text>
                        <FlatList
                            data={habilidades}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#ccc' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
                                    <Text>Dano: {item.dano}</Text>
                                    <Text>Custo de Mana: {item.custoMana}</Text>
                                    <Text>Nível: {item.nivel}</Text>
                                </View>
                            )}
                        />
                    </>
                )}
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={estilo.modalContainer}>
                        <View style={estilo.modalContent}>
                            <Text style={estilo.title}>Escolha um Personagem</Text>
                            <FlatList
                                data={personagens}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={estilo.personagemItem}
                                        onPress={() => selecionarPersonagem(item)}
                                    >
                                        <Text style={estilo.personagemText}>{item.nome}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={estilo.closeButton}>
                                <Text style={estilo.closeText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}
