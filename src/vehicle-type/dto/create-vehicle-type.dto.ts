import { Make } from 'src/make/entities/make.entity';

export class CreateVehicleTypeDto {
  typeId: number;
  typeName: string;
  makes?: Make[];
}
