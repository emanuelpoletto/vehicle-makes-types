import { Test, TestingModule } from '@nestjs/testing';
import { ProcessorService } from './processor.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { MakesParsed } from 'src/processor/interfaces/make-parsed.interface';
import { VehicleTypesParsed } from './interfaces/vehicle-type-parsed.interface';

describe('ProcessorService', () => {
  let service: ProcessorService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ProcessorService],
    }).compile();

    service = module.get<ProcessorService>(ProcessorService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should request all makes and parse them correctly', async () => {
    const makesXml =
      '<Response><Results><AllVehicleMakes><Make_ID>1</Make_ID><Make_Name>Test Make</Make_Name></AllVehicleMakes></Results></Response>';
    const makesParsed: MakesParsed = new XMLParser().parse(makesXml);

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of({ data: makesXml } as AxiosResponse));
    jest.spyOn(service['xmlParser'], 'parse').mockReturnValueOnce(makesParsed);

    const result = await service.requestAllMakes();

    expect(result).toEqual([{ makeId: 1, makeName: 'Test Make' }]);
  });

  it('should request vehicle types by make id and parse them correctly', async () => {
    const vehicleTypesXml =
      '<Response><Results><VehicleTypesForMakeIds><VehicleTypeId>1</VehicleTypeId><VehicleTypeName>Test Type</VehicleTypeName></VehicleTypesForMakeIds></Results></Response>';
    const vehicleTypesParsed: VehicleTypesParsed = new XMLParser().parse(
      vehicleTypesXml,
    );

    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() =>
        of({ data: vehicleTypesXml } as AxiosResponse),
      );
    jest
      .spyOn(service['xmlParser'], 'parse')
      .mockReturnValueOnce(vehicleTypesParsed);

    const result = await service.requestVehicleTypesByMakeId(1);

    expect(result).toEqual([{ typeId: 1, typeName: 'Test Type' }]);
  });

  it('should handle errors in requestData method', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() =>
        throwError(() => ({ response: { data: 'Error' } })),
      );

    await expect(service['requestData']('some-url')).rejects.toEqual(
      'An error happened!',
    );
  });
});
