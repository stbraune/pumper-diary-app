export class Utils {
  public static byDate<T>(map: (item: T) => Date) {
    return (a: T, b: T) => map(a).getTime() - map(b).getTime();
  }

  public static by<T>(map: (item: T) => number) {
    return (a: T, b: T) => map(a) - map(b);
  }
}

export const byDate = Utils.byDate;
export const by = Utils.by;
