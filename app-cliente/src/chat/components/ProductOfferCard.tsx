
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { ProductOfferMessage } from '../interfaces/chat-message.interface';
import { styles } from './ProductOfferCard.styles';

interface Props {
  mensaje: ProductOfferMessage;
  onAprobar: (mensaje: ProductOfferMessage) => void;
  onRechazar: (mensaje: ProductOfferMessage) => void;
  procesando: boolean;
}

export default function ProductOfferCard({
  mensaje,
  onAprobar,
  onRechazar,
  procesando
}: Props) {

  const { product, status } = mensaje;

  const estados = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    rejected: 'Rechazada'
  };

  return (
    <View style={styles.contenedor}>

      <Text style={styles.titulo}>Oferta de producto</Text>

      {product.imageUrl && (
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.imagen}
        />
      )}

      <Text style={styles.nombre}>{product.name}</Text>

      <Text style={styles.precio}>
        {product.price.toLocaleString()} {product.currency}
      </Text>

      <Text style={styles.estado}>
        Estado: {estados[status]}
      </Text>

      {status === 'pending' && (
        <View style={styles.botones}>

          <TouchableOpacity
            style={styles.botonAprobar}
            disabled={procesando}
            onPress={() => onAprobar(mensaje)}
          >
            <Text style={styles.textoBoton}>Aprobar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonRechazar}
            disabled={procesando}
            onPress={() => onRechazar(mensaje)}
          >
            <Text style={styles.textoBoton}>Rechazar</Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  );
}
