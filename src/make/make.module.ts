import { Module } from '@nestjs/common';
import { MakeService } from './make.service';
import { MakeController } from './make.controller';
import { Make } from './entities/make.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessorModule } from '../processor/processor.module';
import { VehicleTypeModule } from '../vehicle-type/vehicle-type.module';
import { MakeResolver } from './make.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Make]),
    ProcessorModule,
    VehicleTypeModule,
  ],
  controllers: [MakeController],
  providers: [MakeService, MakeResolver],
})
export class MakeModule {}
