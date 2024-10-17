import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { XMLParser } from 'fast-xml-parser';
import { MakesParsed } from 'src/processor/interfaces/make-parsed.interface';
import { VehicleTypesParsed } from './interfaces/vehicle-type-parsed.interface';
import { Make } from 'src/make/entities/make.entity';
import { VehicleType } from 'src/vehicle-type/entities/vehicle-type.entity';

@Injectable()
export class ProcessorService {
  private readonly logger = new Logger(ProcessorService.name);
  private readonly xmlParser = new XMLParser();
  private readonly getAllMakesUrl =
    'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes';
  private readonly getVehicleTypeByMakeIdBaseUrl =
    'https://vpic.nhtsa.dot.gov/api/vehicles/getvehicletypesformakeid';

  constructor(private readonly httpService: HttpService) {}

  async requestAllMakes() {
    this.logger.log('Requesting all makes...');
    const makesXml: string = await this.requestData(this.getAllMakesUrl);

    this.logger.log('Parsing all makes...');
    const makesParsed: MakesParsed = this.xmlParser.parse(makesXml);
    const makes = Array.isArray(makesParsed.Response.Results.AllVehicleMakes)
      ? makesParsed.Response.Results.AllVehicleMakes
      : [makesParsed.Response.Results.AllVehicleMakes];

    return makes.map(
      (parsedMake): Make => ({
        makeId: parsedMake.Make_ID,
        makeName: parsedMake.Make_Name,
      }),
    );
  }

  async requestVehicleTypesByMakeId(makeId: number) {
    this.logger.log(`Requesting vehicle types for make ${makeId}...`);
    const vehicleTypesXml: string = await this.requestData(
      `${this.getVehicleTypeByMakeIdBaseUrl}/${makeId}?format=xml`,
    );

    this.logger.log(`Parsing vehicle types for make ${makeId}...`);
    const vehicleTypesParsed: VehicleTypesParsed =
      this.xmlParser.parse(vehicleTypesXml);
    const vehicleTypes = Array.isArray(
      vehicleTypesParsed.Response.Results.VehicleTypesForMakeIds,
    )
      ? vehicleTypesParsed.Response.Results.VehicleTypesForMakeIds
      : [vehicleTypesParsed.Response.Results.VehicleTypesForMakeIds];

    return vehicleTypes.map(
      (vehicleTypeParsed): VehicleType => ({
        typeId: vehicleTypeParsed.VehicleTypeId,
        typeName: vehicleTypeParsed.VehicleTypeName,
      }),
    );
  }

  private async requestData(url: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    return data;
  }
}
