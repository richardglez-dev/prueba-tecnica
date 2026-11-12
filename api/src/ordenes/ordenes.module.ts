import { Module } from '@nestjs/common';
import { OrdenesController } from './controladores/ordenes.controller';
import { OrdenesService } from './servicios/ordenes.service';

@Module({
  controllers: [OrdenesController],
  providers: [OrdenesService]
})
export class OrdenesModule {}
