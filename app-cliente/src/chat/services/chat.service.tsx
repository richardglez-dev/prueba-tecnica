import { ref, push, onValue, runTransaction } from 'firebase/database';
import { database } from '../../config/firebase.config';
import type { ChatMessage } from '../interfaces/chat-message.interface';

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
      console.error('Error al recibir mensajes:', error);
      onError?.(error);
    }
  );
};

export const sendTextMessage = async (
  chatId: string,
  text: string
): Promise<string> => {

  if (!text.trim()) {
    throw new Error('El mensaje no puede estar vacío');
  }

  const mensajesRef = ref(database, `chats/${chatId}/messages`);

  const mensaje = {
    sender: 'cliente',
    type: 'text',
    text: text.trim(),
    createdAt: Date.now()
  };

  const resultado = await push(mensajesRef, mensaje);

  if (!resultado.key) {
    throw new Error('No se pudo generar el identificador');
  }

  return resultado.key;
};



export const answerOffer = async (
  chatId: string,
  messageId: string,
  accepted: boolean
): Promise<void> => {

  const ofertaRef = ref(
    database,
    `chats/${chatId}/messages/${messageId}`
  );

  const resultado = await runTransaction(ofertaRef, (oferta) => {

    // Solamente responder ofertas pendientes
    if (
      !oferta ||
      oferta.type !== 'product_offer' ||
      oferta.status !== 'pending'
    ) {
      return;
    }

    return {
      ...oferta,
      status: accepted ? 'accepted' : 'rejected'
    };
  });

  if (!resultado.committed) {
    throw new Error('Esta oferta ya fue respondida o no existe');
  }
};



