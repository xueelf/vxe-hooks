# vxe-hooks

[![npm](https://img.shields.io/npm/v/vxe-hooks?style=flat-square&logo=npm&logoColor=CB3837&labelColor=FAFAFA)](https://www.npmjs.com/package/vxe-hooks)
![downloads](https://img.shields.io/npm/dt/vxe-hooks?style=flat-square&logo=tinder&logoColor=FF8C00&labelColor=FAFAFA)

基于 [vxe-table](https://github.com/x-extends/vxe-table) 的 Vue Composition API Hooks 封装，提供更简洁的表格组件使用方式。

## ✨ 特性

- **开箱即用**：简化复杂的组件配置
- **轻量级**：无需配置 JSX 也可直接使用
- **TypeScript 支持**：完整的类型定义

## 📦 安装

> 注意：`vxe-table` 是必需依赖项，请确保同时安装

```bash
npm install vxe-table vxe-hooks
```

## 🔨 使用

```vue
<script setup lang="ts">
  import { useTable } from 'vxe-hooks';

  interface RowVO {
    id: number;
    name: string;
    role: string;
    sex: string;
    age: number;
    address: string;
  }

  const [Table] = useTable<RowVO>({
    columns: [
      { type: 'seq', width: 70 },
      { field: 'name', title: 'Name' },
      { field: 'sex', title: 'Sex' },
      { field: 'age', title: 'Age' },
    ],
    data: [
      { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
      { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
      { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
      { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    ],
  });
</script>

<template>
  <div>
    <Table />
  </div>
</template>
```

上述代码中，options 并非一个响应式对象，若需要动态修改表格配置项，应使用 `reactive`。

```vue
<script setup lang="ts">
  import { onMounted, reactive } from 'vue';
  import { type TableOptions, useTable } from 'vxe-hooks';

  interface RowVO {
    id: number;
    name: string;
    role: string;
    sex: string;
    age: number;
    address: string;
  }

  const options = reactive<TableOptions<RowVO>>({
    columns: [
      { type: 'seq', width: 70 },
      { field: 'name', title: 'Name' },
      { field: 'sex', title: 'Sex' },
      { field: 'age', title: 'Age' },
    ],
    data: [],
  });
  const [Table] = useTable(options);

  onMounted(() => {
    options.data = [
      { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
      { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
      { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
      { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    ];
  });
</script>

<template>
  <div>
    <Table />
  </div>
</template>
```

除此之外，你还可以直接使用组件实例上的方法，而无需单独编写 `ref`。

```vue
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useTable } from 'vxe-hooks';

  interface RowVO {
    id: number;
    name: string;
    role: string;
    sex: string;
    age: number;
    address: string;
  }

  const [Table, { reloadData }] = useTable<RowVO>({
    columns: [
      { type: 'seq', width: 70 },
      { field: 'name', title: 'Name' },
      { field: 'sex', title: 'Sex' },
      { field: 'age', title: 'Age' },
    ],
  });

  onMounted(() => {
    reloadData([
      { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
      { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
      { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
      { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    ]);
  });
</script>

<template>
  <div>
    <Table />
  </div>
</template>
```

## 📚 API

**useTable(options)**

返回一个元组 **[TableComponent, TableActions]**

**参数**

| 参数    | 类型         | 说明                                                                   |
| ------- | ------------ | ---------------------------------------------------------------------- |
| options | TableOptions | 表格配置项，同 [VxeGridProps](https://vxetable.cn/#/table/api?q=props) |

**返回值**

| 参数           | 类型         | 说明                                                                                         |
| -------------- | ------------ | -------------------------------------------------------------------------------------------- |
| TableComponent | VueComponent | 表格组件                                                                                     |
| TableActions   | TableActions | 表格实例方法集，同 [VxeTableInstance](https://vxetable.cn/#/table/api?q=methods)，仅返回函数 |

## 🧩 扩展能力

与 vxe-table 功能完全兼容，所有 vxe-table 的属性和事件都可以直接传入对应的 Hooks 进行配置。

你可以使用下列类似的方式，来轻松实现自定义 Hooks：

```typescript
import axios from 'axios';
import { useTable } from 'vxe-hooks';

interface CustomTableOptions extends TableOptions {
  searchConfig?: {
    url: string;
    params?: Record<string, unknown>;
  };
}

async function useCustomTable(options: CustomTableOptions) {
  if (options.searchConfig?.url) {
    const { url, params } = options.searchConfig;
    const { data } = await axios.get(url, {
      params,
    });

    options.data = data;
  }
  return useTable(options);
}
```

## 🕊️ TODO

- [x] useTable
- [ ] useModal
