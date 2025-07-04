import { defineComponent, ref, computed, h, watch } from 'vue';
import {
  type VxeGridProps,
  type VxeGridEventProps,
  type VxeTableInstance,
  VxeGrid,
} from 'vxe-table';
import { type InstanceActions, createInstanceActions } from './util';

export type TableOptions<D = any> = VxeGridProps<D>;
export type TableProps<D = any> = VxeGridProps<D> & VxeGridEventProps<D>;
export type TableInstance = VxeTableInstance | null;
export type TableActions = InstanceActions<VxeTableInstance>;

export function useTable<D>(
  options?: TableOptions<D>,
): [ReturnType<typeof defineComponent<TableProps<D>>>, InstanceActions<VxeTableInstance>] {
  // 兼容 Vue 3.5-，不使用 useTemplateRef
  const instanceRef = ref<TableInstance>(null);
  const instanceActions = createInstanceActions<VxeTableInstance>(instanceRef, 'Table');

  const Table = defineComponent<TableProps<D>>({
    setup(props, { attrs, slots }) {
      const attributes = computed(() => {
        return { ...options, ...props, ...attrs };
      });

      watch(
        () => attributes.value.columns,
        async columns => {
          if (Array.isArray(columns) === false) {
            return;
          }
          await instanceRef.value?.loadColumn(columns);
        },
        {
          deep: true,
        },
      );
      return () =>
        h(
          VxeGrid,
          {
            ref: instanceRef,
            ...attributes.value,
          },
          slots,
        );
    },
  });

  return [Table, instanceActions];
}
