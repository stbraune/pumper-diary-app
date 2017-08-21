import { Injectable } from '@angular/core';

@Injectable()
export class UnitConverterService {
  public static readonly units = {
    km: 'km',
    mi: 'mi',
    kg: 'kg',
    lb: 'lb'
  };

  public static readonly facs = {
    km_in_mi: 0.621371,
    lb_in_kg: 0.45359237
  };

  public convert(value: number): { from: (unit: string) => { to: (unit: string) => number } } {
    return {
      from: (source: string) => {
        switch (source) {
          case UnitConverterService.units.km:
            return this.fromKm(value);
          case UnitConverterService.units.mi:
            return this.fromMi(value);
          case UnitConverterService.units.kg:
            return this.fromKg(value);
          case UnitConverterService.units.lb:
            return this.fromLb(value);
          default:
            return {
              to: (target: string) => {
                return 0;
              }
            };
        }
      }
    };
  }

  public fromKm(value: number): { to: (unit: string) => number } {
    return {
      to: (target: string) => {
        if (target === UnitConverterService.units.km) {
          return value;
        }

        if (target == UnitConverterService.units.mi) {
          return value * UnitConverterService.facs.km_in_mi;
        }

        throw new Error(`Cannot convert '${value}' from 'km' to '${target}'`);
      }
    };
  }

  public fromMi(value: number): { to: (unit: string) => number } {
    return {
      to: (target: string) => {
        if (target === UnitConverterService.units.mi) {
          return value;
        }

        if (target == UnitConverterService.units.km) {
          return value / UnitConverterService.facs.km_in_mi;
        }

        throw new Error(`Cannot convert '${value}' from 'mi' to '${target}'`);
      }
    };
  }

  public fromKg(value: number): { to: (unit: string) => number } {
    return {
      to: (target: string) => {
        if (target === UnitConverterService.units.kg) {
          return value;
        }

        if (target == UnitConverterService.units.lb) {
          return value / UnitConverterService.facs.lb_in_kg;
        }

        throw new Error(`Cannot convert '${value}' from 'kg' to '${target}'`);
      }
    };
  }

  public fromLb(value: number): { to: (unit: string) => number } {
    return {
      to: (target: string) => {
        if (target === UnitConverterService.units.lb) {
          return value;
        }

        if (target == UnitConverterService.units.kg) {
          return value * UnitConverterService.facs.lb_in_kg;
        }

        throw new Error(`Cannot convert '${value}' from 'lb' to '${target}'`);
      }
    };
  }
}
