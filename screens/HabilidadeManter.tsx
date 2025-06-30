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
                <TextInput
                    placeholder="Nome da Habilidade"
                    style={estilo.input}
                    value={formHabilidade.nome}
                    onChangeText={texto => setFormHabilidade({ ...formHabilidade, nome: texto })}
                />
                <TextInput
                    placeholder="Dano"
                    style={estilo.input}
                    keyboardType="numeric"
                    value={formHabilidade.dano}
                    onChangeText={texto => setFormHabilidade({ ...formHabilidade, dano: texto })}
                />
                <TextInput
                    placeholder="Custo de Mana"
                    style={estilo.input}
                    keyboardType="numeric"
                    value={formHabilidade.custoMana}
                    onChangeText={texto => setFormHabilidade({ ...formHabilidade, custoMana: texto })}
                />
                <TextInput
                    placeholder="Nível"
                    style={estilo.input}
                    keyboardType="numeric"
                    value={formHabilidade.nivel}
                    onChangeText={texto => setFormHabilidade({ ...formHabilidade, nivel: texto })}
                />
            </View>

            <View style={estilo.buttonContainer}>
                <TouchableOpacity style={estilo.button} onPress={salvar}>
                    <Text style={estilo.buttonText}>Salvar Habilidade</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilo.button, estilo.buttonOutline]} onPress={limpar}>
                    <Text style={[estilo.buttonText, estilo.buttonOutlineText]}>Limpar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
