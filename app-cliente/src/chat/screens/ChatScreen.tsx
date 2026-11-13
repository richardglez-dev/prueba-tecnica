import { useEffect, useState } from 'react';
import { View,Text,FlatList,ActivityIndicator,Alert,TextInput,TouchableOpacity,KeyboardAvoidingView,Platform,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import Constants from 'expo-constants';
import { auth } from '../../config/firebase.config';
import MessageBubble from '../components/MessageBubble';
import ProductOfferCard from '../components/ProductOfferCard';
import {listenMessages,answerOffer,sendTextMessage} from '../services/chat.service';
import type {ChatMessage, ProductOfferMessage} from '../interfaces/chat-message.interface';
import { registrarPedido } from '../services/orders.service';
import { styles } from './ChatScreen.styles';

const chatId = Constants.expoConfig?.extra?.chatId as
  | string
  | undefined;

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
      <SafeAreaView
        style={styles.container}
        edges={['top', 'bottom']}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
  
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Chat Emassiva
          </Text>
        </View>


        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        <FlatList
          style={styles.messageList}
          data={mensajes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageListContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <View style={styles.messageItem}>
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
  
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribir mensaje..."
            placeholderTextColor="#9CA3AF"
            value={texto}
            onChangeText={setTexto}
            multiline
          />

          <TouchableOpacity
            onPress={enviarMensaje}
            disabled={enviandoMensaje || !texto.trim()}
            style={[
              styles.sendButton,
              (enviandoMensaje || !texto.trim()) &&
                styles.sendButtonDisabled,
            ]}
          >
            <Text style={styles.sendButtonText}>
              Enviar
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
