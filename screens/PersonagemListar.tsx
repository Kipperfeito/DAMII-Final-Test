import React, { useState, useEffect } from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { auth, firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from "react-native";
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
            style={styles.item}
            onPress={() => editar(item)}
            onLongPress={() => excluir(item)}
        >
            <Image
                source={{ uri: item.foto }}
                style={styles.fotoListar}
            />
            <View style={styles.detalhes}>
                <Text><Text style={styles.tituloLabel}>Nome: </Text><Text style={styles.tituloValor}>{item.nome}</Text></Text>
                <Text><Text style={styles.tituloLabel}>Força: </Text><Text style={styles.tituloValor}>{item.forca}</Text></Text>
                <Text><Text style={styles.tituloLabel}>Destreza: </Text><Text style={styles.tituloValor}>{item.destreza}</Text></Text>
                <Text><Text style={styles.tituloLabel}>Velocidade: </Text><Text style={styles.tituloValor}>{item.velocidade}</Text></Text>
                <Text><Text style={styles.tituloLabel}>Resistência: </Text><Text style={styles.tituloValor}>{item.resistencia}</Text></Text>
                <Text><Text style={styles.tituloLabel}>Inteligência: </Text><Text style={styles.tituloValor}>{item.inteligencia}</Text></Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={personagens}
                renderItem={criaItem}
                keyExtractor={(item) => item.id}
                refreshing={loading}
                onRefresh={() => setLoading(true)}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5e8e2', // tom claro que contrasta com o marrom escuro
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    item: {
        backgroundColor: '#7a3d1f',
        marginVertical: 8,
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    fotoListar: {
        width: 125,
        height: 125,
        margin: 15,
    },
    detalhes: {
        flex: 1,
    },
    tituloLabel: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    tituloValor: {
        fontSize: 16,
        color: '#ffd342',
        fontWeight: 'normal',
    }
})
