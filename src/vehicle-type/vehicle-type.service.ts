import { Injectable } from '@nestjs/common';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';
import { VehicleType } from './entities/vehicle-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginationInput,
  PaginationOutput,
} from '../pagination/pagination.interface';
import {
  PAGINATION_SKIP_DEFAULT,
  PAGINATION_TAKE_DEFAULT,
  PAGINATION_TAKE_LIMIT,
} from '../pagination/pagination.constants';

@Injectable()
export class VehicleTypeService {
  constructor(
    @InjectRepository(VehicleType)
    private vehicleTypeRepository: Repository<VehicleType>,
  ) {}

  create(createVehicleTypeDto: CreateVehicleTypeDto) {
    return this.vehicleTypeRepository.save(createVehicleTypeDto);
  }

  createInBatch(createVehicleTypesDto: CreateVehicleTypeDto[]) {
    return this.vehicleTypeRepository.save(createVehicleTypesDto, {
      chunk: 1000,
    });
  }

  async findAll({ skip, take }: PaginationInput): Promise<{
    vehicleTypes: VehicleType[];
    pagination: PaginationOutput;
  }> {
    const pagination = {
      skip: skip ?? PAGINATION_SKIP_DEFAULT,
      take:
        take && take > 0
          ? Math.min(take, PAGINATION_TAKE_LIMIT)
          : PAGINATION_TAKE_DEFAULT,
    };
    const [vehicleTypes, count] = await this.vehicleTypeRepository.findAndCount(
      { ...pagination },
    );

    return { vehicleTypes, pagination: { ...pagination, count } };
  }

  findOneById(id: number) {
    return this.vehicleTypeRepository.findOneBy({ typeId: id });
  }

  update(id: number, updateVehicleTypeDto: UpdateVehicleTypeDto) {
    return this.vehicleTypeRepository.update(id, updateVehicleTypeDto);
  }

  remove(id: number) {
    return this.vehicleTypeRepository.delete(id);
  }
}
