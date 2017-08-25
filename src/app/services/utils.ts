export class Utils {
  public static byDate<T>(map: (item: T) => Date) {
    return (a: T, b: T) => map(a).getTime() - map(b).getTime();
  }
}

export const byDate = Utils.byDate;
