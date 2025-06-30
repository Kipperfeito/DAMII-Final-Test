import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container:{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    inputContainer: {
        width: '80%',
        alignItems: "center",
        justifyContent: "center"
    },
    input:{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        width: "100%"
    },

    buttonContainer: {
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: '#7a3d1f',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 15
    },
    buttonOutline: {
        backgroundColor: 'white',
        borderColor: '#7a3d1f',
        borderWidth: 2
    },
    buttonOutlineText: {
        color: '#7a3d1f'
    },
    vazio: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },

    //FLATLIST
    item: {
        backgroundColor: 'white',
        borderColor: '#7a3d1f',
        borderWidth: 2,
        borderRadius: 15,
        padding: 20,
        marginVertical: 10,
        flexDirection: 'row',
        columnGap: 10
    },
    detalhes: {
        flexDirection: 'column'
    },
    titulo: {
        fontSize: 18,
        color: '#7a3d1f',
        fontWeight: 500
    },
    
    foto: {
        height: 200,
        width: 200,
        borderRadius: 100,
        marginBottom: 30,
    },
    fotoListar: {
        height: 120,
        width: 120,
        borderRadius: 10
    },
    fotoTexto: {
        marginTop: 20,
        color: '#555',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
      },
      modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%'
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
      },
      personagemItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ddd'
      },
      personagemText: {
        fontSize: 16
      },
      closeButton: {
        marginTop: 15,
        alignSelf: 'center'
      },
      closeText: {
        color: '#7a3d1f',
        fontWeight: 'bold'
      }
});