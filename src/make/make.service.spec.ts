import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MakeService } from './make.service';
import { Make } from './entities/make.entity';
import { VehicleTypeService } from '../vehicle-type/vehicle-type.service';
import { ProcessorService } from '../processor/processor.service';
import { Repository } from 'typeorm';
import { CreateMakeDto } from './dto/create-make.dto';
import { UpdateMakeDto } from './dto/update-make.dto';

describe('MakeService', () => {
  let service: MakeService;
  let repository: Repository<Make>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeService,
        {
          provide: getRepositoryToken(Make),
          useClass: Repository,
        },
        {
          provide: VehicleTypeService,
          useValue: {
            createInBatch: jest.fn(),
          },
        },
        {
          provide: ProcessorService,
          useValue: {
            requestAllMakes: jest.fn(),
            requestVehicleTypesByMakeId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MakeService>(MakeService);
    repository = module.get<Repository<Make>>(getRepositoryToken(Make));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new make', async () => {
      const createMakeDto: CreateMakeDto = { makeId: 1, makeName: 'Test Make' };
      jest.spyOn(repository, 'save').mockResolvedValue(createMakeDto as Make);

      const result = await service.create(createMakeDto);
      expect(result).toEqual(createMakeDto);
    });
  });

  describe('findAll', () => {
    it('should return all makes with pagination', async () => {
      const makes: Make[] = [
        { makeId: 1, makeName: 'Test Make', vehicleTypes: [] },
      ];
      const count = 1;
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([makes, count]);
      jest
        .spyOn(service, 'hydrateMakesWithVehicleTypes')
        .mockResolvedValue(makes);

      const result = await service.findAll({ skip: 0, take: 10 });
      expect(result).toEqual({
        makes,
        pagination: { skip: 0, take: 10, count },
      });
    });
  });

  describe('findOneById', () => {
    it('should return a make by id', async () => {
      const make: Make = { makeId: 1, makeName: 'Test Make', vehicleTypes: [] };
      jest.spyOn(repository, 'findOne').mockResolvedValue(make);
      jest
        .spyOn(service, 'hydrateMakesWithVehicleTypes')
        .mockResolvedValue([make]);

      const result = await service.findOneById(1);
      expect(result).toEqual(make);
    });
  });

  describe('update', () => {
    it('should update a make', async () => {
      const make: Make = { makeId: 1, makeName: 'Test Make', vehicleTypes: [] };
      const updateMakeDto: UpdateMakeDto = { makeName: 'Updated Make' };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(make);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...make, ...updateMakeDto });

      const result = await service.update(1, updateMakeDto);
      expect(result).toEqual({ ...make, ...updateMakeDto });
    });

    it('should throw an error if make not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.update(1, { makeName: 'Updated Make' }),
      ).rejects.toThrow('Make not found');
    });
  });

  describe('remove', () => {
    it('should remove a make', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: undefined });

      const result = await service.remove(1);
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('hydrateMakesWithVehicleTypes', () => {
    it('should hydrate makes with vehicle types', async () => {
      const make: Make = { makeId: 1, makeName: 'Test Make', vehicleTypes: [] };
      const vehicleType = { typeId: 1, typeName: 'Test Vehicle Type' };
      jest
        .spyOn(service['processorService'], 'requestVehicleTypesByMakeId')
        .mockResolvedValue([vehicleType]);
      jest
        .spyOn(service['vehicleTypeService'], 'createInBatch')
        .mockResolvedValue(undefined);
      jest.spyOn(repository, 'save').mockResolvedValue(make);

      const result = await service.hydrateMakesWithVehicleTypes([make]);
      expect(result).toEqual([{ ...make, vehicleTypes: [vehicleType] }]);
    });
  });
});
