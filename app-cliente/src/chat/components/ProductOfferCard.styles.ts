
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  contenedor: {
    width: '88%',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 15,
    marginVertical: 5,
  },

  titulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 10,
  },

  imagen: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },

  nombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 5,
  },

  precio: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  estado: {
    fontSize: 13,
    color: '#6B7280',
  },

  botones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  botonAprobar: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botonRechazar: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoBoton: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
