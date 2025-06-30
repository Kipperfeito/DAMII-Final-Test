import * as React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import PersonagemManter from "./PersonagemManter";
import PersonagemListar from './PersonagemListar';
import HabilidadeManter from './HabilidadeManter';
import HabilidadeListar from './HabilidadeListar';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';


const Drawer = createDrawerNavigator();

function CustomHeaderLeft() {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
            <Image
                source={require('../assets/icone.png')}
                style={{ width: '48', height: '48', borderRadius: 20, margin: 5 }}
            />
        </TouchableOpacity>
    );
}

export default function Menu() {
    return (
        <Drawer.Navigator
            initialRouteName="Página Inicial"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#7a3d1f',
                },
                headerTintColor: '#fff',
                headerLeft: () => <CustomHeaderLeft />
            }}
        >
            <Drawer.Screen name="Página Inicial" component={Home} />
            <Drawer.Screen name="Cadastrar Personagem" component={PersonagemManter} />
            <Drawer.Screen name="Listar Personagem" component={PersonagemListar} />
            <Drawer.Screen name="Cadastrar Habilidade" component={HabilidadeManter} />
            <Drawer.Screen name="Listar Habilidade" component={HabilidadeListar} />
        </Drawer.Navigator>
    )
}