
import type { ProductOfferMessage } from '../interfaces/chat-message.interface';

interface Props { mensaje: ProductOfferMessage;}

export default function ProductOfferCard({ mensaje }: Props) {

  const { product, status } = mensaje;

  const estados = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    rejected: 'Rechazada'
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: 15
    }}>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: 12,
        padding: 15,
        width: 280,
        backgroundColor: '#fff'
      }}>

        <h3>Oferta de producto</h3>

        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: 150,
              objectFit: 'cover',
              borderRadius: 8
            }}
          />
        )}

        <h4>{product.name}</h4>

        <p>
          Precio: {product.price.toLocaleString()} {product.currency}
        </p>

        <p>
          Estado: <strong>{estados[status]}</strong>
        </p>

      </div>
    </div>
  );
}
