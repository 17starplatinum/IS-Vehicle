export type SpecialOpName =
  | 'sumFuelConsumption'
  | 'groupByFuelConsumption'
  | 'resetDistanceToZero';

export interface GroupByFuelConsumptionItem {
  fuelConsumption: number;
  count: number;
}

export type SpecialOpResult =
  | number                      
  | GroupByFuelConsumptionItem[]
  | void;
