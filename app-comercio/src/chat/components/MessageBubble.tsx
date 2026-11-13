
import type { TextMessage } from '../interfaces/chat-message.interface';

interface Props {
  mensaje: TextMessage;
}

export default function MessageBubble({ mensaje }: Props) {

  const esComercio = mensaje.sender === 'comercio';

  return (
    <div style={{
      display: 'flex',
      justifyContent: esComercio ? 'flex-end' : 'flex-start',
      marginBottom: 12
    }}>
      <div style={{
        backgroundColor: esComercio ? '#DCF8C6' : '#F1F1F1',
        padding: '10px 15px',
        borderRadius: 12,
        maxWidth: '75%'
      }}>
        <strong>{mensaje.sender}</strong>

        <p style={{ margin: '5px 0' }}>
          {mensaje.text}
        </p>

        <small>
          {new Date(mensaje.createdAt).toLocaleTimeString()}
        </small>
      </div>
    </div>
  );
}
