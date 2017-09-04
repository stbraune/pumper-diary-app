import * as uuidv4 from 'uuid/v4';

export class Utils {
  public static byDate<T>(map: (item: T) => Date) {
    return (a: T, b: T) => map(a).getTime() - map(b).getTime();
  }

  public static by<T>(map: (item: T) => number) {
    return (a: T, b: T) => map(a) - map(b);
  }

  public static toUuid(id: number): string {
    const idLength = ('' + id).length;
    const uuidTemplate = '00000000-0000-0000-0000-000000000000';
    return uuidTemplate.substr(0, uuidTemplate.length - idLength) + id;
  }

  public static uuid() {
    return uuidv4();
  }
}

export const byDate = Utils.byDate;
export const by = Utils.by;
export const toUuid = Utils.toUuid;
export const uuid = Utils.uuid;
