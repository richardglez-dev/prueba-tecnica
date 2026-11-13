
import { useEffect, useState } from 'react';
import {View,Text,FlatList,ActivityIndicator, Alert, TextInput, TouchableOpacity} from 'react-native';
import MessageBubble from '../components/MessageBubble';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase.config';
import Constants from 'expo-constants';
import ProductOfferCard from '../components/ProductOfferCard';
import { listenMessages, answerOffer, sendTextMessage } from '../services/chat.service';
import type { ChatMessage, ProductOfferMessage } from '../interfaces/chat-message.interface';
import { registrarPedido } from '../services/orders.service';

const chatId = Constants.expoConfig?.extra?.chatId as string | undefined;

export default function ChatScreen() {

  const [mensajes, setMensajes] = useState<ChatMessage[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ofertaProcesando, setOfertaProcesando] = useState<string | null>(null);
  const [texto, setTexto] = useState('');
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);

  useEffect(() => {
    let cancelarListener: (() => void) | undefined;

    const cancelarAuth = onAuthStateChanged(auth, (usuario) => {
      cancelarListener?.();
      cancelarListener = undefined;

      if (!usuario) {
        setCargando(true);
        return;
      }

      if (!chatId) {
        setError('No se configuró el identificador del chat');
        setCargando(false);
        return;
      }

      cancelarListener = listenMessages(
        chatId,
        (datos) => {
          setMensajes(datos);
          setCargando(false);
        },
        (error) => {
          setError(error.message);
          setCargando(false);
        }
      );
    });

    return () => {
      cancelarListener?.();
      cancelarAuth();
    };
  }, []);


 
    const aprobarOferta = async (mensaje: ProductOfferMessage) => {
      if (!chatId || ofertaProcesando) return;

      try {
        setError('');
        setOfertaProcesando(mensaje.id);
        await registrarPedido(chatId, mensaje);

        console.log('Pedido registrado');

        await answerOffer(chatId, mensaje.id, true);

        Alert.alert('Éxito', 'Oferta aprobada correctamente');

      } catch (error) {
        console.error('Error al aprobar oferta:', error);

        if (error instanceof Error) {
          console.error('Detalle:', error.stack);
        }

        Alert.alert('Error', 'No se pudo completar la aprobación');

      } finally {
        setOfertaProcesando(null);
      }
    };


    const rechazarOferta = async (mensaje: ProductOfferMessage) => {
      if (!chatId || ofertaProcesando) return;

      try {
        setError('');
        setOfertaProcesando(mensaje.id);

        await answerOffer(chatId, mensaje.id, false);

        Alert.alert('Oferta rechazada', 'La oferta fue rechazada');

      } catch (error) {
        console.error('Error al rechazar oferta:', error);
        Alert.alert('Error', 'No se pudo rechazar la oferta');
      } finally {
        setOfertaProcesando(null);
      }
    };


    const enviarMensaje = async () => {
      if (!chatId || !texto.trim() || enviandoMensaje) return;

      try {
        setEnviandoMensaje(true);
        setError('');

        await sendTextMessage(chatId, texto.trim());

        setTexto('');

      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        Alert.alert('Error', 'No se pudo enviar el mensaje');
      } finally {
        setEnviandoMensaje(false);
      }
    };



  if (cargando) {
    return (
      <ActivityIndicator size="large" />
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Chat del cliente
      </Text>

      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

     
    <FlatList
      data={mensajes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ paddingVertical: 5 }}>
          {item.type === 'text' ? (
            <MessageBubble mensaje={item} />
          ) : (
            <ProductOfferCard
              mensaje={item}
              onAprobar={aprobarOferta}
              onRechazar={rechazarOferta}
              procesando={ofertaProcesando === item.id}
            />
          )}
        </View>
      )}
    />

  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10
  }}>
    <TextInput
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        padding: 12
      }}
      placeholder="Escribir mensaje..."
      value={texto}
      onChangeText={setTexto}
    />

    <TouchableOpacity
      onPress={enviarMensaje}
      disabled={enviandoMensaje || !texto.trim()}
      style={{
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8
      }}
    >
      <Text style={{ color: '#FFFFFF' }}>
        Enviar
      </Text>
    </TouchableOpacity>
  </View>


    </View>
  );
}
