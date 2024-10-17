import { VehicleType } from 'src/vehicle-type/entities/vehicle-type.entity';

export class CreateMakeDto {
  makeId: number;
  makeName: string;
  vehicleTypes?: VehicleType[];
}
