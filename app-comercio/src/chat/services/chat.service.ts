import { ref, push, onValue } from 'firebase/database';
import { database } from '../../config/firebase.config';
import type { ChatMessage, Product } from '../interfaces/chat-message.interface';

export const sendTextMessage = async (
  chatId: string,
  text: string
): Promise<string> => {

  const mensajesRef = ref(database, `chats/${chatId}/messages`);

  const mensaje = {
    sender: 'comercio',
    type: 'text',
    text: text,
    createdAt: Date.now()
  };

  const resultado = await push(mensajesRef, mensaje);

  if (!resultado.key) {
    throw new Error('No se pudo generar el identificador del mensaje');
  }

  return resultado.key;
};

export const sendProductOffer = async (
  chatId: string,
  product: Product
): Promise<string> => {

  const mensajesRef = ref(database, `chats/${chatId}/messages`);

  const oferta = {
    sender: 'comercio',
    type: 'product_offer',
    status: 'pending',
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      ...(product.imageUrl ? { imageUrl: product.imageUrl } : {})
    },
    createdAt: Date.now()
  };

  const resultado = await push(mensajesRef, oferta);

  if (!resultado.key) {
    throw new Error('No se pudo generar el identificador de la oferta');
  }

  return resultado.key;
};

export const listenMessages = (
  chatId: string,
  onMessages: (mensajes: ChatMessage[]) => void,
  onError?: (error: Error) => void
): (() => void) => {

  const mensajesRef = ref(database, `chats/${chatId}/messages`);

  return onValue(
    mensajesRef,
    (snapshot) => {

      const datos = snapshot.val() as Record<
        string,
        Omit<ChatMessage, 'id'>
      > | null;

      const mensajes: ChatMessage[] = Object.entries(datos ?? {})
        .map(([id, mensaje]) => ({
          ...mensaje,
          id
        }) as ChatMessage)
        .sort((a, b) => a.createdAt - b.createdAt);

      onMessages(mensajes);
    },
    (error) => {
      console.error('Error al escuchar mensajes:', error);
      onError?.(error);
    }
  );
};