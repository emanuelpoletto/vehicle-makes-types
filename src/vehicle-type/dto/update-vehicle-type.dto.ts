import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleTypeDto } from './create-vehicle-type.dto';

export class UpdateVehicleTypeDto extends PartialType(CreateVehicleTypeDto) {}
