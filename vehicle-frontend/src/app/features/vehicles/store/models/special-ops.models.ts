import { Vehicle } from './vehicles.models';

export type SpecialOpName =
  | 'sumFuelConsumption'
  | 'groupByFuelConsumption'
  | 'filterByFuelTypeLessThan'
  | 'findByEnginePowerRange'
  | 'resetDistanceToZero';

export interface GroupByFuelConsumptionItem {
  fuelConsumption: number;
  count: number;
}

export type SpecialOpResult =
  | number                      // for sum
  | GroupByFuelConsumptionItem[]// for grouping
  | Vehicle[]                   // for queries returning vehicles
  | void;                       // for resetDistance (server returns void)
