import * as React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import PersonagemManter from "./PersonagemManter";
import PersonagemListar from './PersonagemListar';

const Drawer = createDrawerNavigator();

export default function Menu () {
    return (
        <Drawer.Navigator initialRouteName="Página Inicial">
            <Drawer.Screen name="Página Inicial" component={Home} />
            <Drawer.Screen name="Cadastrar Personagem" component={PersonagemManter}/>
            <Drawer.Screen name="Listar Personagem" component={PersonagemListar}/>
        </Drawer.Navigator>
    )
}