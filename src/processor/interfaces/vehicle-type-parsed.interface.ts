type VehicleTypeParsed = {
  VehicleTypeId: number;
  VehicleTypeName: string;
};

export interface VehicleTypesParsed {
  Response: {
    Count: number;
    Message: string;
    SearchCriteria: string;
    Results: {
      VehicleTypesForMakeIds: VehicleTypeParsed | VehicleTypeParsed[];
    };
  };
}
