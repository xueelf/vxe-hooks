import { type Ref } from 'vue';

export type InstanceActions<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
} & {
  getInstance(): T;
};

export function createInstanceActions<T>(ref: Ref, name: string): InstanceActions<T> {
  return new Proxy(<InstanceActions<T>>{}, {
    get(_, prop) {
      return (...args: any[]) => {
        if (ref.value === null) {
          throw new Error(`Component instance ${name} has not been mounted yet`);
        }
        if (prop === 'getInstance') {
          return ref.value;
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
