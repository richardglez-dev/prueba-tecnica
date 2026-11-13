
import { View, Text, StyleSheet } from 'react-native';
import type { TextMessage } from '../interfaces/chat-message.interface';
import { styles } from './MessageBubble.styles';

interface Props {
  mensaje: TextMessage;
}

export default function MessageBubble({ mensaje }: Props) {

  const esCliente = mensaje.sender === 'cliente';

  return (
    <View style={[
      styles.contenedor,
      esCliente ? styles.derecha : styles.izquierda
    ]}>
      <View style={[
        styles.burbuja,
        esCliente ? styles.burbujaCliente : styles.burbujaComercio
      ]}>
        <Text style={styles.remitente}>
          {mensaje.sender}
        </Text>

        <Text style={styles.texto}>
          {mensaje.text}
        </Text>

        <Text style={styles.hora}>
          {new Date(mensaje.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
}
