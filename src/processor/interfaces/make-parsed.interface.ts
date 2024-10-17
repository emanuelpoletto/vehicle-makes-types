type MakeParsed = {
  Make_ID: number;
  Make_Name: string;
};

export interface MakesParsed {
  Response: {
    Count: number;
    Message: string;
    Results: {
      AllVehicleMakes: MakeParsed | MakeParsed[];
    };
  };
}
