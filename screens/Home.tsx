import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import estilo from "../estilo";
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

export default function Home() {
    const navigation = useNavigation();

    const logout = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login");
            })
    }

    return (
        <View style={estilo.container}>
            <Image
                source={require('../assets/logo.png')}
                style={{ width: 500, height: 500 }}
            />

            <View style={estilo.buttonContainer}>
                <TouchableOpacity
                    style={estilo.button}
                    onPress={logout}
                >
                    <Text style={estilo.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}



