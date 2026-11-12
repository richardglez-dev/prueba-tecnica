export class CreateOrderDto{
    chatId: string;
  messageId: string;
  product: {
    id: string;
    name: string;
    price: number;
    currency: string;
    imageUrl?: string;
  };

}