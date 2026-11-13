
import {Controller,Post,Get,Body,Param,BadRequestException
} from '@nestjs/common';

import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@Controller('orders')
export class OrdersController {

  constructor(
    private readonly ordersService: OrdersService
  ) {}

  @Post()
  registrarPedido(@Body() datos: CreateOrderDto) {

    if (!datos?.chatId || !datos?.product?.id) {
      throw new BadRequestException(
        'El chatId y el identificador del producto son obligatorios'
      );
    }
     
     //Validacionesss
    //Precio > 0
  if (
    typeof datos.product.price !== 'number' ||
    !Number.isFinite(datos.product.price) ||
    datos.product.price <= 0
  ) {
    throw new BadRequestException(
      'El precio del producto debe ser mayor que cero'
    );
  }

    return this.ordersService.registrarPedido(datos);
  }

  @Get(':id')
  obtenerPedidoPorId(@Param('id') id: string) {
    return this.ordersService.obtenerPedidoPorId(id);
  }


}
