import { useEffect, useState } from 'react';
import { auth } from '../../config/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import MessageBubble from '../components/MessageBubble';
import ProductOfferCard from '../components/ProductOfferCard';
import {listenMessages,sendTextMessage, sendProductOffer } from '../services/chat.service';

import type { ChatMessage } from '../interfaces/chat-message.interface';


const chatId = import.meta.env.VITE_CHAT_ID;

export default function ChatPage() {

  const [mensajes, setMensajes] = useState<ChatMessage[]>([]);
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
const [precioProducto, setPrecioProducto] = useState('');
const [enviandoOferta, setEnviandoOferta] = useState(false);

  useEffect(() => {

    let cancelarListener: (() => void) | undefined;

    const cancelarAuth = onAuthStateChanged(auth, (usuario) => {

      cancelarListener?.();
      cancelarListener = undefined;

      if (!usuario) {
        setCargando(true);
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

  const enviarMensaje = async () => {
    if (!texto.trim()) return;

    try {
      setError('');
      await sendTextMessage(chatId, texto.trim());
      setTexto('');
    } catch (error) {
      console.error(error);
      setError('No se pudo enviar el mensaje');
    }
  };


const enviarOferta = async () => {
  const precio = Number(precioProducto);

  if (
    !nombreProducto.trim() ||
    !precioProducto.trim() ||
    !Number.isFinite(precio) ||
    precio <= 0
  ) {
    setError('Ingresá un producto y un precio válido');
    return;
  }

  try {
    setError('');
    setEnviandoOferta(true);

    await sendProductOffer(chatId, {
      id: crypto.randomUUID(),
      name: nombreProducto.trim(),
      price: precio,
      currency: 'PYG'
    });

    setNombreProducto('');
    setPrecioProducto('');

  } catch (error) {
    console.error(error);
    setError('No se pudo enviar la oferta');
  } finally {
    setEnviandoOferta(false);
  }
};


  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
      <h1>Chat del comercio</h1>

      {cargando && <p>Cargando mensajes...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{
        border: '1px solid #ccc',
        padding: 15,
        minHeight: 300,
        marginBottom: 20
      }}>
      
     {mensajes.map((mensaje) => (
      <div key={mensaje.id}>
        {mensaje.type === 'text' ? (
          <MessageBubble mensaje={mensaje} />
        ) : (
          <ProductOfferCard mensaje={mensaje} />
        )}
      </div>
    ))}
          </div>

      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribir mensaje..."
      />

      <button onClick={enviarMensaje}>
        Enviar
      </button>
     
        <div style={{
          marginTop: 25,
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: 10
        }}>
          <h3>Enviar oferta de producto</h3>

          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio"
            min="1"
            value={precioProducto}
            onChange={(e) => setPrecioProducto(e.target.value)}
          />

          <button
            onClick={enviarOferta}
            disabled={enviandoOferta}
          >
            {enviandoOferta ? 'Enviando...' : 'Enviar oferta'}
          </button>
        </div>
    </div>
  );
}
