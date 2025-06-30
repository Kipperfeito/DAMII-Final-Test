import React, { useEffect, useState } from 'react';
import { Image, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import estilo from "../estilo";
import { auth, firestore, storage } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Personagem } from '../model/Personagem';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes } from 'firebase/storage';

export default function PersonagemManter() {
    const navigation = useNavigation();
    const [imagePath, setImagePath] = useState('https://i.pinimg.com/736x/b4/ef/d2/b4efd2db313e76462f0a6e7ae4509af3.jpg');
    const route = useRoute();

    const TOTAL_PONTOS = 25;
    const [formPersonagem, setFormPersonagem] = useState<Partial<Personagem>>({
        forca: '0',
        destreza: '0',
        velocidade: '0',
        resistencia: '0',
        inteligencia: '0',
    });
    const somaAtributos = () => {
        const { forca = '0', destreza = '0', velocidade = '0', resistencia = '0', inteligencia = '0' } = formPersonagem;
        return (
            parseInt(forca) +
            parseInt(destreza) +
            parseInt(velocidade) +
            parseInt(resistencia) +
            parseInt(inteligencia)
        );
    };
    
    const pontosRestantes = TOTAL_PONTOS - somaAtributos();

    const refPersonagem = firestore
        .collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Personagem");

    useEffect(() => {
        if (route.params && route.params.personagem) {
            setFormPersonagem(route.params.personagem);
            setImagePath(route.params.personagem.foto);
        }
    }, [route.params]);

    const salvar = () => {
        const personagem = new Personagem(formPersonagem);
        if (pontosRestantes < 0) {
            alert(`Você excedeu o limite de ${TOTAL_PONTOS} pontos!`);
            return;
        }
        else if (formPersonagem.id) {
            const refId = refPersonagem.doc(personagem.id);
            refId.update(personagem.toFirestore())
                .then(() => {
                    alert("Personagem Atualizado!");
                    Limpar();
                })
                .catch(error => alert(error.message));
        } 
        else {
            const refId = refPersonagem.doc();
            personagem.id = refId.id;
            refId.set(personagem.toFirestore())
                .then(() => {
                    alert("Personagem Cadastrado!");
                    Limpar();
                })
                .catch(error => alert(error.message));
        }
    };

    const Limpar = () => {
        setFormPersonagem({});
        setImagePath('https://i.pinimg.com/736x/b4/ef/d2/b4efd2db313e76462f0a6e7ae4509af3.jpg');
    };

    const selecionaFoto = () => {
        Alert.alert('Selecionar Foto', 'Escolha uma das alternativas:', [
            { text: 'Câmera', onPress: abrirCamera },
            { text: 'Abrir Galeria', onPress: abrirGaleria }
        ]);
    };

    const abrirCamera = async () => {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
            alert("Você recusou o acesso à câmera!");
            return;
        }

        const foto = await ImagePicker.launchCameraAsync({ allowsEditing: true });
        enviaFoto(foto);
    };

    const abrirGaleria = async () => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissao.granted) {
            alert("Você recusou o acesso à galeria!");
            return;
        }

        const foto = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        enviaFoto(foto);
    };

    const enviaFoto = async (foto) => {
        if (!foto.assets || foto.assets.length === 0) return;

        const uri = foto.assets[0].uri;
        const filename = foto.assets[0].fileName || uri.split('/').pop();
        const ref = storage.ref(`imagens/${filename}`);

        const img = await fetch(uri);
        const bytes = await img.blob();
        const result = await uploadBytes(ref, bytes);

        const urlDownload = await storage.ref(result.metadata.fullPath).getDownloadURL();
        setImagePath(uri);
        setFormPersonagem({ ...formPersonagem, foto: urlDownload });
    };

    return (
        <View style={estilo.container}>
            <View style={estilo.inputContainer}>
                <TouchableOpacity style={estilo.foto} onPress={selecionaFoto}>
                    <Image source={{ uri: imagePath }} style={estilo.foto} />
                </TouchableOpacity>

                <TextInput
                    placeholder='Nome'
                    style={estilo.input}
                    value={formPersonagem.nome}
                    onChangeText={texto => setFormPersonagem({ ...formPersonagem, nome: texto })}
                />
                <TextInput
                    placeholder='Força'
                    style={estilo.input}
                    value={formPersonagem.forca}
                    keyboardType='numeric'
                    onChangeText={texto => setFormPersonagem({ ...formPersonagem, forca: texto })}
                />
                <TextInput
                    placeholder='Destreza'
                    style={estilo.input}
                    value={formPersonagem.destreza}
                    keyboardType='numeric'
                    onChangeText={texto => setFormPersonagem({ ...formPersonagem, destreza: texto })}
                />
                <TextInput
                    placeholder='Velocidade'
                    style={estilo.input}
                    value={formPersonagem.velocidade}
                    keyboardType='numeric'
                    onChangeText={texto => setFormPersonagem({ ...formPersonagem, velocidade: texto })}
                />
                <TextInput
                    placeholder='Resistência'
                    style={estilo.input}
                    value={formPersonagem.resistencia}
                    keyboardType='numeric'
                    onChangeText={texto => setFormPersonagem({ ...formPersonagem, resistencia: texto })}
                />
                <TextInput
                    placeholder='Inteligência'
                    style={estilo.input}
                    value={formPersonagem.inteligencia}
                    keyboardType='numeric'
                    onChangeText={texto => setFormPersonagem({ ...formPersonagem, inteligencia: texto })}
                />
            </View>

            <View style={estilo.buttonContainer}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                Pontos restantes: {pontosRestantes < 0 ? 0 : pontosRestantes}
            </Text>
                <TouchableOpacity style={estilo.button} onPress={salvar}>
                    <Text style={estilo.buttonText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilo.button, estilo.buttonOutline]} onPress={Limpar}>
                    <Text style={[estilo.buttonText, estilo.buttonOutlineText]}>Limpar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
