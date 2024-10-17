import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleTypeService } from './vehicle-type.service';
import { VehicleType } from './entities/vehicle-type.entity';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';

describe('VehicleTypeService', () => {
  let service: VehicleTypeService;
  let repository: Repository<VehicleType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleTypeService,
        {
          provide: getRepositoryToken(VehicleType),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<VehicleTypeService>(VehicleTypeService);
    repository = module.get<Repository<VehicleType>>(
      getRepositoryToken(VehicleType),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vehicle type', async () => {
      const createVehicleTypeDto: CreateVehicleTypeDto = {
        typeId: 1,
        typeName: 'Sedan',
      };
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue(createVehicleTypeDto as VehicleType);

      expect(await service.create(createVehicleTypeDto)).toEqual(
        createVehicleTypeDto,
      );
    });
  });

  describe('createInBatch', () => {
    it('should create multiple vehicle types', async () => {
      const createVehicleTypesDto: CreateVehicleTypeDto[] = [
        { typeId: 1, typeName: 'Sedan' },
        { typeId: 2, typeName: 'SUV' },
      ];
      const createdVehicleType: VehicleType = createVehicleTypesDto[0];
      jest.spyOn(repository, 'save').mockResolvedValue(createdVehicleType);

      expect(await service.createInBatch(createVehicleTypesDto)).toEqual(
        createdVehicleType,
      );
    });
  });

  describe('findAll', () => {
    it('should return all vehicle types with pagination', async () => {
      const vehicleTypes: VehicleType[] = [{ typeId: 1, typeName: 'Sedan' }];
      const pagination = { skip: 0, take: 10, count: 1 };
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValue([vehicleTypes, 1]);

      expect(await service.findAll({ skip: 0, take: 10 })).toEqual({
        vehicleTypes,
        pagination,
      });
    });
  });

  describe('findOneById', () => {
    it('should return a vehicle type by id', async () => {
      const vehicleType: VehicleType = { typeId: 1, typeName: 'Sedan' };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(vehicleType);

      expect(await service.findOneById(1)).toEqual(vehicleType);
    });
  });

  describe('update', () => {
    it('should update a vehicle type', async () => {
      const updateVehicleTypeDto: UpdateVehicleTypeDto = { typeName: 'Coupe' };
      jest.spyOn(repository, 'update').mockResolvedValue({
        affected: 1,
        raw: updateVehicleTypeDto,
        generatedMaps: undefined,
      });

      expect(await service.update(1, updateVehicleTypeDto)).toEqual({
        affected: 1,
        raw: updateVehicleTypeDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a vehicle type', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: undefined });

      expect(await service.remove(1)).toEqual({ affected: 1 });
    });
  });
});
