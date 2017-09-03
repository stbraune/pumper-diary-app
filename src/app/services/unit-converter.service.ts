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
            throw new Error(`Unsupported source unit ${source}`);
        }
      }
    };
  }

  public fromKm(value: number): { to: (unit: string) => number } {
    return this.convertFrom(value, UnitConverterService.units.km, (target: string) => {
      if (target == UnitConverterService.units.mi) {
        return value * UnitConverterService.facs.km_in_mi;
      }
    });
  }

  public fromMi(value: number): { to: (unit: string) => number } {
    return this.convertFrom(value, UnitConverterService.units.mi, (target: string) => {
      if (target == UnitConverterService.units.km) {
        return value / UnitConverterService.facs.km_in_mi;
      }
    });
  }

  public fromKg(value: number): { to: (unit: string) => number } {
    return this.convertFrom(value, UnitConverterService.units.kg, (target: string) => {
      if (target == UnitConverterService.units.lb) {
        return value / UnitConverterService.facs.lb_in_kg;
      }
    });
  }

  public fromLb(value: number): { to: (unit: string) => number } {
    return this.convertFrom(value, UnitConverterService.units.lb, (target: string) => {
      if (target == UnitConverterService.units.kg) {
        return value * UnitConverterService.facs.lb_in_kg;
      }
    });
  }

  private convertFrom(value: number, source: string, convert: (unit: string) => number | undefined) {
    return {
      to: (target: string) => {
        if (target === source) {
          return value;
        }

        const result = convert(target);
        if (result) {
          return result;
        }

        throw new Error(`Cannot convert '${value}' from '${source}' to '${target}'`);
      }
    };
  }
}
