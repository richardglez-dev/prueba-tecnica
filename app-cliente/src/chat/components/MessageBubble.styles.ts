import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contenedor: {
    marginVertical: 5,
    flexDirection: 'row'
  },
  derecha: {
    justifyContent: 'flex-end'
  },
  izquierda: {
    justifyContent: 'flex-start'
  },
  burbuja: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12
  },
  burbujaCliente: {
    backgroundColor: '#DCF8C6'
  },
  burbujaComercio: {
    backgroundColor: '#EAEAEA'
  },
  remitente: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  texto: {
    fontSize: 15
  },
  hora: {
    fontSize: 11,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 5
  }
});