import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import estilo from "../estilo";
import { auth, firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Usuario } from '../model/Usuario';

export default function Registro () {
    const navigation = useNavigation();
    
    const [formUsuario, setFormUsuario] = 
        useState<Partial<Usuario>>({});

    const refUsuario = firestore.collection("Usuario");        

    const voltarLogin = () =>{
        navigation.replace('Login');        
    }

    const fazerLogin = () => {
        auth
            .createUserWithEmailAndPassword(formUsuario.email, formUsuario.senha)
            .then( userCredentials => {
                const usuario = userCredentials.user;
                console.log('Registrado com email: ', usuario.email)

                const idUsuario = refUsuario.doc(auth.currentUser.uid);
                idUsuario.set({
                    id:     auth.currentUser.uid,
                    nome:   formUsuario.nome,
                    email:  formUsuario.email,
                    senha:  formUsuario.senha,
                    fone:   formUsuario.fone
                })

            })
            .catch(error => alert(error.message))
    }

    return(
        <View style={estilo.container}>
            <View style={estilo.inputContainer}>
                <TextInput
                    placeholder='Nome'
                    style={estilo.input}
                    onChangeText={texto => setFormUsuario({
                        ...formUsuario, nome: texto
                    })}
                />
                <TextInput
                    placeholder='Email'
                    style={estilo.input}
                    keyboardType='email-address'
                    onChangeText={texto => setFormUsuario({
                        ...formUsuario, email: texto
                    })}
                />
                <TextInput
                    placeholder='Senha'
                    style={estilo.input}
                    secureTextEntry={true}
                    onChangeText={texto => setFormUsuario({
                        ...formUsuario, senha: texto
                    })}
                />
                <TextInput
                    placeholder='Telefone'
                    style={estilo.input}
                    keyboardType='phone-pad'
                    onChangeText={texto => setFormUsuario({
                        ...formUsuario, fone: texto
                    })}
                />

            </View>

            <View style={estilo.buttonContainer}>
                <TouchableOpacity
                    style={estilo.button}
                    onPress={fazerLogin}
                >
                    <Text style={estilo.buttonText}>Salvar</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[estilo.button, estilo.buttonOutline]}
                    onPress={voltarLogin}
                >
                    <Text style={[estilo.buttonText, estilo.buttonOutlineText]}>
                        Voltar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>


    );


}