
import Constants from 'expo-constants';
import type { ProductOfferMessage } from '../interfaces/chat-message.interface';

const apiUrl = Constants.expoConfig?.extra?.apiUrl as string | undefined;

export const registrarPedido = async (
  chatId: string,
  mensaje: ProductOfferMessage
): Promise<void> => {

  if (!apiUrl) {
    throw new Error('No se configuró la URL de la API');
  }

  const respuesta = await fetch(`${apiUrl}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId,
      messageId: mensaje.id,
      product: mensaje.product
    })
  });

  if (respuesta.status === 409) {
  console.log('El pedido ya se encuentra registrado');
  return;
}

if (!respuesta.ok) {
  throw new Error(`No se pudo registrar el pedido: ${respuesta.status}`);
}

};
