import { BaseRepoInstance } from "./repo";

// Type to recursively strip repo instances and handle conditional types
type StripRepoType<T> =
  T extends BaseRepoInstance<any, infer D>
    ? D
    : T extends undefined
      ? undefined
      : T extends null
        ? null
        : T extends (infer U)[]
          ? StripRepoType<U>[]
          : T extends object
            ? { [K in keyof T]: StripRepoType<T[K]> }
            : T;

// Helper function to convert data at runtime
export const convertResponse = <T>(data: T): StripRepoType<T> => {
  // Handle null/undefined
  return data as StripRepoType<T>;
};
