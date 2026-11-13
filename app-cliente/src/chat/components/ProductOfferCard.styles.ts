
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10
  },
  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8
  },
  precio: {
    fontSize: 16,
    marginBottom: 8
  },
  estado: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  botonAprobar: {
    flex: 1,
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  botonRechazar: {
    flex: 1,
    backgroundColor: '#DC3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
