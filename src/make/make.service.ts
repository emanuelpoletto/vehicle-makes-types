import { Injectable, Logger } from '@nestjs/common';
import { CreateMakeDto } from './dto/create-make.dto';
import { UpdateMakeDto } from './dto/update-make.dto';
import { Repository } from 'typeorm';
import { Make, MakesResponse } from './entities/make.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessorService } from '../processor/processor.service';
import { CreateVehicleTypeDto } from '../vehicle-type/dto/create-vehicle-type.dto';
import { VehicleTypeService } from '../vehicle-type/vehicle-type.service';
import { PaginationInput } from '../pagination/pagination.interface';
import {
  PAGINATION_SKIP_DEFAULT,
  PAGINATION_TAKE_DEFAULT,
  PAGINATION_TAKE_LIMIT,
} from '../pagination/pagination.constants';

@Injectable()
export class MakeService {
  private readonly logger = new Logger(MakeService.name);

  constructor(
    @InjectRepository(Make)
    private makeRepository: Repository<Make>,
    private readonly vehicleTypeService: VehicleTypeService,
    private readonly processorService: ProcessorService,
  ) {}

  async onModuleInit() {
    const count = await this.makeRepository.count();
    if (count) return;

    this.logger.log('Requesting makes from external API...');
    const makes = await this.processorService.requestAllMakes();
    await this.createInBatch(makes);
  }

  create(createMakeDto: CreateMakeDto) {
    return this.makeRepository.save(createMakeDto);
  }

  createInBatch(createMakesDto: CreateMakeDto[]) {
    return this.makeRepository.save(createMakesDto, { chunk: 1000 });
  }

  async findAll({ skip, take }: PaginationInput): Promise<MakesResponse> {
    const pagination = {
      skip: skip ?? PAGINATION_SKIP_DEFAULT,
      take:
        take && take > 0
          ? Math.min(take, PAGINATION_TAKE_LIMIT)
          : PAGINATION_TAKE_DEFAULT,
    };
    const [makes, count] = await this.makeRepository.findAndCount({
      ...pagination,
      relations: ['vehicleTypes'],
    });
    const hydratedMakes = await this.hydrateMakesWithVehicleTypes(makes);

    return { makes: hydratedMakes, pagination: { ...pagination, count } };
  }

  async findOneById(id: number) {
    const make = await this.makeRepository.findOne({
      where: { makeId: id },
      relations: ['vehicleTypes'],
    });
    const [hydratedMake] = await this.hydrateMakesWithVehicleTypes([make]);

    return hydratedMake;
  }

  async update(id: number, updateMakeDto: UpdateMakeDto) {
    const make = await this.makeRepository.findOneBy({ makeId: id });

    if (!make) {
      throw new Error('Make not found');
    }
    const updatedMake = { ...make, ...updateMakeDto, id };

    return this.makeRepository.save(updatedMake);
  }

  remove(id: number) {
    return this.makeRepository.delete(id);
  }

  async hydrateMakesWithVehicleTypes(makes: Make[]) {
    const createVehicleTypes = new Map<number, CreateVehicleTypeDto>();
    const hydratedMakes = await Promise.all(
      makes.map(async (make) => {
        if (make.vehicleTypes && make.vehicleTypes.length) return make;

        make.vehicleTypes =
          await this.processorService.requestVehicleTypesByMakeId(make.makeId);
        make.vehicleTypes.forEach((vehicleType) => {
          createVehicleTypes.set(vehicleType.typeId, vehicleType);
        });

        return make;
      }),
    );

    if (createVehicleTypes.size) {
      await this.vehicleTypeService.createInBatch([
        ...createVehicleTypes.values(),
      ]);
      await this.makeRepository.save(hydratedMakes);
    }

    return hydratedMakes;
  }
}
