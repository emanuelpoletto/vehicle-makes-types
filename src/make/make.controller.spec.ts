import { Test, TestingModule } from '@nestjs/testing';
import { MakeController } from './make.controller';
import { MakeService } from './make.service';
import { CreateMakeDto } from './dto/create-make.dto';
import { UpdateMakeDto } from './dto/update-make.dto';

describe('MakeController', () => {
  let controller: MakeController;
  let service: MakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakeController],
      providers: [
        {
          provide: MakeService,
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            findAll: jest.fn().mockResolvedValue([]),
            findOneById: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<MakeController>(MakeController);
    service = module.get<MakeService>(MakeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a make', async () => {
      const createMakeDto: CreateMakeDto = { makeId: 1, makeName: 'Test Make' };
      await controller.create(createMakeDto);
      expect(service.create).toHaveBeenCalledWith(createMakeDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of makes', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should call findAll with skip and take', async () => {
      const skip = 0;
      const take = 10;
      await controller.findAll(skip, take);
      expect(service.findAll).toHaveBeenCalledWith({ skip, take });
    });
  });

  describe('findOne', () => {
    it('should return a single make', async () => {
      const id = '1';
      const result = await controller.findOne(id);
      expect(result).toEqual({});
      expect(service.findOneById).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should update a make', async () => {
      const id = '1';
      const updateMakeDto: UpdateMakeDto = { makeName: 'Updated Make' };
      await controller.update(id, updateMakeDto);
      expect(service.update).toHaveBeenCalledWith(+id, updateMakeDto);
    });
  });

  describe('remove', () => {
    it('should remove a make', async () => {
      const id = '1';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });
});
