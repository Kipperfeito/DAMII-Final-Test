import React, { useState, useEffect } from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import estilo from "../estilo";
import { auth, firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Personagem } from '../model/Personagem';

export default function PersonagemListar() {
    const navigation = useNavigation();
    const [personagens, setPersonagens] = useState<Personagem[]>([]);
    const [loading, setLoading] = useState(true);

    const refPersonagem = firestore
        .collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Personagem")
        .orderBy("nome", "asc");

    const delPersonagem = firestore
        .collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Personagem");

    useEffect(() => {
        if (loading) {
            listarPersonagens();
        }
    }, [loading]);

    const listarPersonagens = () => {
        const unsubscribe = refPersonagem.onSnapshot((querySnapshot) => {
            const lista: Personagem[] = [];
            querySnapshot.forEach((doc) => {
                lista.push({
                    ...doc.data(),
                    id: doc.id,
                } as Personagem);
            });
            setPersonagens(lista);
            setLoading(false);
        });

        return () => unsubscribe();
    };

    const excluir = async (item: Personagem) => {
        await delPersonagem
            .doc(item.id)
            .delete()
            .then(() => {
                alert("Personagem excluído!");
                setLoading(true);
            });
    };

    const editar = (item: Personagem) => {
        navigation.navigate("Cadastrar Personagem", { personagem: item });
    };

    const criaItem = ({ item }) => (
        <TouchableOpacity
            style={estilo.item}
            onPress={() => editar(item)}
            onLongPress={() => excluir(item)}
        >
            <Image
                source={{ uri: item.foto }}
                style={estilo.fotoListar}
            />
            <View style={estilo.detalhes}>
                <Text style={estilo.titulo}>Nome: {item.nome}</Text>
                <Text style={estilo.titulo}>Força: {item.forca}</Text>
                <Text style={estilo.titulo}>Destreza: {item.destreza}</Text>
                <Text style={estilo.titulo}>Velocidade: {item.velocidade}</Text>
                <Text style={estilo.titulo}>Resistência: {item.resistencia}</Text>
                <Text style={estilo.titulo}>Inteligência: {item.inteligencia}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={estilo.container}>
            <FlatList
                data={personagens}
                renderItem={criaItem}
                keyExtractor={(item) => item.id}
                refreshing={loading}
                onRefresh={() => setLoading(true)}
            />
        </SafeAreaView>
    );
}
