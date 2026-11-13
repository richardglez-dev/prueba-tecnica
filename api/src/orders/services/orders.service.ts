import { Injectable, NotFoundException,ConflictException } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../interfaces/order.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  private pedidos: Order[] = [];

  

  registrarPedido(datos: CreateOrderDto): Order {

    const pedidoExistente = this.pedidos.find(
      pedido =>
        pedido.chatId === datos.chatId &&
        pedido.messageId === datos.messageId
    );

    if (pedidoExistente) {
      throw new ConflictException('Este pedido ya existe');
    }

    const pedido: Order = {
      id: randomUUID(),
      chatId: datos.chatId,
      messageId: datos.messageId,
      product: datos.product,
      status: 'created',
      createdAt: Date.now()
    };

    this.pedidos.push(pedido);

    return pedido;
  }



  obtenerPedidoPorId(id: string): Order {
    const pedido = this.pedidos.find(p => p.id === id);

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }
}
