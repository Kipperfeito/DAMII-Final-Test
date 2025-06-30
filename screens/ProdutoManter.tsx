import React, { useEffect, useState } from 'react';
import { Image, Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import estilo from "../estilo";
import { auth, firestore, storage } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Produto } from '../model/Produto';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes } from 'firebase/storage';


export default function ProdutoManter () {
    const navigation = useNavigation();
    const [imagePath, setImagePath] = useState('https://i.pinimg.com/736x/b4/ef/d2/b4efd2db313e76462f0a6e7ae4509af3.jpg');
    
    const route = useRoute();

    const [formProduto, setFormProduto] = 
        useState<Partial<Produto>>({});

    const refProduto = firestore.collection("Usuario")
        .doc(auth.currentUser?.uid)
        .collection("Produto");

    const voltarHome = () => {
        navigation.replace('Home');        
    }

    useEffect(() => {
        if (route.params && route.params.produto){
            setFormProduto(route.params.produto); 
            setImagePath(route.params.produto.foto);
            console.log(formProduto);
        }
    }, [route.params])


    const salvar = () => {
        const produto = new Produto(formProduto);

        if (formProduto.id){
            const refIdProduto = refProduto.doc(produto.id);
            
            refIdProduto.update(produto.toFirestore())
            .then(() => {
                alert("Produto Atualizado!");
                Limpar();
            })
            .catch( error => alert(error.message))
        } else {
            const refIdProduto = refProduto.doc();            
            produto.id = refIdProduto.id;
            
            refIdProduto.set(produto.toFirestore())
            .then(() => {
                alert("Produto Adicionado!")   
                Limpar();         
            })
            .catch( error => alert(error.message))
        }
    }

    const Limpar = () => {
        setFormProduto({});
        setImagePath('https://i.pinimg.com/736x/b4/ef/d2/b4efd2db313e76462f0a6e7ae4509af3.jpg');
    }

    const selecionaFoto = () => {
        Alert.alert(
            'Selecionar Foto',
            'Escolha uma das alternativas:',
            [
                {
                    text: 'Câmera',
                    onPress: () => abrirCamera()  
                },
                {
                    text: 'Abrir Galeria',
                    onPress: () => abrirGaleria()
                }
            ]
        )
    }

    const abrirCamera = async() => {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (permissao.granted === false) {
            alert("Você recusou o acesso à câmera!");
            return;
        }

        const foto = await ImagePicker.launchCameraAsync({
            allowsEditing: true
        });                
        enviaFoto(foto);
    }


    const abrirGaleria = async() => {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissao.granted === false) {
            alert("Você recusou o acesso à câmera!");
            return;
        }

        const foto = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,            
        });        
        enviaFoto(foto);
    }

    const enviaFoto = async (foto) => {
        setImagePath(foto.assets[0].uri);
        const filename = foto.assets[0].fileName;
        const ref = storage.ref(`imagens/${filename}`);

        const img = await fetch(foto.assets[0].uri);
        const bytes = await img.blob();
        const result = await uploadBytes(ref, bytes);
        
        const urlDownload = await storage.ref(
            result.metadata.fullPath
        ).getDownloadURL();

        setFormProduto({ ... formProduto, foto: urlDownload})
    }

    return(
        <View style={estilo.container}>
            <View style={estilo.inputContainer}>
                

                <TouchableOpacity
                    style={estilo.foto}
                    onPress={selecionaFoto}
                >
                    <Image source={{ uri: imagePath }} style={estilo.foto} />
                </TouchableOpacity>

                <TextInput
                    placeholder='Descrição'
                    style={estilo.input}
                    value={formProduto.descricao}
                    onChangeText={texto => setFormProduto({
                        ...formProduto, descricao: texto
                    })}
                />
                <TextInput
                    placeholder='Preço'
                    style={estilo.input}
                    value={formProduto.preco}
                    keyboardType='decimal-pad'
                    onChangeText={texto => setFormProduto({
                        ...formProduto, preco: texto
                    })}
                />
                <TextInput
                    placeholder='Estoque'
                    style={estilo.input}
                    value={formProduto.estoque}
                    keyboardType='decimal-pad'
                    onChangeText={texto => setFormProduto({
                        ...formProduto, estoque: texto
                    })}
                />
            </View>

            <View style={estilo.buttonContainer}>
                <TouchableOpacity
                    style={estilo.button}
                    onPress={salvar}
                >
                    <Text style={estilo.buttonText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[estilo.button, estilo.buttonOutline]}
                    onPress={Limpar}
                >
                    <Text style={[estilo.buttonText, estilo.buttonOutlineText]}>
                        Limpar
                    </Text>
                </TouchableOpacity>

            </View>
        </View>


    );


}