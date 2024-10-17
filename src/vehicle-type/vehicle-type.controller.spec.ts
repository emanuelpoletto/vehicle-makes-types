import { Test, TestingModule } from '@nestjs/testing';
import { VehicleTypeController } from './vehicle-type.controller';
import { VehicleTypeService } from './vehicle-type.service';
import { CreateVehicleTypeDto } from './dto/create-vehicle-type.dto';
import { UpdateVehicleTypeDto } from './dto/update-vehicle-type.dto';

describe('VehicleTypeController', () => {
  let controller: VehicleTypeController;
  let service: VehicleTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleTypeController],
      providers: [
        {
          provide: VehicleTypeService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleTypeController>(VehicleTypeController);
    service = module.get<VehicleTypeService>(VehicleTypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a vehicle type', async () => {
      const dto: CreateVehicleTypeDto = { typeId: undefined, typeName: 'SUV' };
      const result = { typeId: 1, ...dto };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of vehicle types', async () => {
      const result = {
        vehicleTypes: [{ typeId: 1, typeName: 'SUV' }],
        pagination: { skip: 0, take: 10, count: 1 },
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an array of vehicle types with pagination', async () => {
      const result = {
        vehicleTypes: [{ typeId: 1, typeName: 'SUV' }],
        pagination: { skip: 0, take: 10, count: 1 },
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll(0, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith({ skip: 0, take: 10 });
    });
  });

  describe('findOne', () => {
    it('should return a single vehicle type', async () => {
      const result = { typeId: 1, typeName: 'SUV' };
      jest.spyOn(service, 'findOneById').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOneById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a vehicle type', async () => {
      const dto: UpdateVehicleTypeDto = { typeName: 'Sedan' };
      const result = { typeId: 1, ...dto };
      jest
        .spyOn(service, 'update')
        .mockResolvedValue({ affected: 1, raw: result, generatedMaps: [] });

      expect(await controller.update('1', dto)).toStrictEqual({
        affected: 1,
        raw: result,
        generatedMaps: [],
      });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a vehicle type', async () => {
      jest
        .spyOn(service, 'remove')
        .mockResolvedValue({ affected: 1, raw: undefined });

      expect(await controller.remove('1')).toStrictEqual({
        affected: 1,
        raw: undefined,
      });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
