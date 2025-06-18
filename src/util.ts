import { type Ref } from 'vue';

export type FunctionProperties<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

export function createInstanceActions<T>(ref: Ref, name: string): FunctionProperties<T> {
  return new Proxy(<FunctionProperties<T>>{}, {
    get(_, prop) {
      return (...args: any[]) => {
        if (ref.value === null) {
          throw new Error(`Component instance ${name} has not been mounted yet`);
        }
        const property = Reflect.get(ref.value, prop);

        if (typeof property !== 'function') {
          throw new Error(`${prop.toString()} is not a function`);
        }
        return property(...args);
      };
    },
  });
}
