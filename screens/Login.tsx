import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import estilo from "../estilo";
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    
    const navigation = useNavigation();

    const logar = () => {
        auth
        .signInWithEmailAndPassword(email, senha)
        .then( userCredentials => {
            console.log('Logou como: ', userCredentials.user.email);            
        })
        .catch(error => alert(error.message))
    }

    useEffect (() => {
        const login = auth.onAuthStateChanged(
            user => {
                if (user) navigation.replace("Menu");
            }
        )
    })

    const irParaRegistro = () => {
        navigation.replace("Registro");
    }


    return (
        <KeyboardAvoidingView style={estilo.container}>
            <View style={estilo.inputContainer}>
                <TextInput 
                    placeholder="Email"
                    style={estilo.input}
                    inputMode='email'
                    onChangeText={email => setEmail(email)}
                />
                <TextInput 
                    placeholder="Senha"
                    style={estilo.input}
                    secureTextEntry={true}
                    onChangeText={senha => setSenha(senha)}
                />
            </View>

            <View style={estilo.buttonContainer}>
                <TouchableOpacity
                    style={estilo.button}
                    onPress={logar}
                >
                    <Text style={estilo.buttonText}>
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[estilo.button, estilo.buttonOutline]}
                    onPress={irParaRegistro}
                >
                    <Text style={[estilo.buttonText, estilo.buttonOutlineText]}>
                        Registrar
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}