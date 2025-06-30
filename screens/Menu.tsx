import * as React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import ProdutoManter from "./ProdutoManter";
import ProdutoListar from './ProdutoListar';

const Drawer = createDrawerNavigator();

export default function Menu () {
    return (
        <Drawer.Navigator initialRouteName="Página Inicial">
            <Drawer.Screen name="Página Inicial" component={Home} />
            <Drawer.Screen name="Cadastrar Produto" component={ProdutoManter}/>
            <Drawer.Screen name="Listar Produto" component={ProdutoListar}/>
        </Drawer.Navigator>
    )
}