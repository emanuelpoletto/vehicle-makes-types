import { Test, TestingModule } from '@nestjs/testing';
import { MakeResolver } from './make.resolver';
import { MakeService } from './make.service';
import { Make, MakesResponse } from './entities/make.entity';
import { Pagination } from 'src/pagination/pagination.class';

describe('MakeResolver', () => {
  let resolver: MakeResolver;
  let service: MakeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeResolver,
        {
          provide: MakeService,
          useValue: {
            findAll: jest.fn(),
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<MakeResolver>(MakeResolver);
    service = module.get<MakeService>(MakeService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getMakes', () => {
    it('should return a list of makes', async () => {
      const pagination: Pagination = { skip: 0, take: 10, count: 0 };
      const result: MakesResponse = { makes: [], pagination };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getMakes()).toBe(result);
    });

    it('should call MakeService with correct parameters', async () => {
      const pagination: Pagination = { skip: 0, take: 10, count: 0 };
      const result: MakesResponse = { makes: [], pagination };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      await resolver.getMakes(pagination.skip, pagination.take);

      expect(service.findAll).toHaveBeenCalledWith({
        skip: pagination.skip,
        take: pagination.take,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      jest.spyOn(service, 'findAll').mockRejectedValue(error);

      await expect(resolver.getMakes()).rejects.toThrow('Test error');
    });
  });

  describe('getMake', () => {
    it('should return a make', async () => {
      const make: Make = { makeId: 1, makeName: 'Test' };
      jest.spyOn(service, 'findOneById').mockResolvedValue(make);

      expect(await resolver.getMake(make.makeId)).toBe(make);
    });

    it('should call MakeService with correct parameters', async () => {
      const make: Make = { makeId: 1, makeName: 'Test' };
      jest.spyOn(service, 'findOneById').mockResolvedValue(make);

      await resolver.getMake(make.makeId);

      expect(service.findOneById).toHaveBeenCalledWith(make.makeId);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      jest.spyOn(service, 'findOneById').mockRejectedValue(error);

      await expect(resolver.getMake(1)).rejects.toThrow('Test error');
    });
  });
});
