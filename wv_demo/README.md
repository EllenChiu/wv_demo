## 開發規範
### 檔案命名規範
- components, views 都採用 PascalCase 方式命名
- utils, apis 檔案則一律使用小寫
- 模組化的進入點一律命名 index
  
### 函數宣告規範
- 使用 const 配合箭頭函數來宣告函式
- 使用 camelCase 命名函式
- 使用動詞或動詞短語
- 若函式返回 Boolean ，可以使用 `is`, `has`, `can` 前綴

  ```javascript
  const getUserData = (param1, param2) => {
    // 函數體
  };
  const isUserLoggedIn = (param1, param2) => {
    // 函數體
  };
  const setUserPreferences = (param1, param2) => {
    // 函數體
  };
  ```
### 變數命名規範
#### 一般變數
- 使用 camelCase 命名變數
- 名稱應該清晰地描述變數的用途
- 避免使用單個字母的變數名（除非是在很小的作用域內，如循環計數器）

```javascript
// 正確
const userAge = 25;
const isActive = true;

// 避免
const a = 25;
const flag = true;
```
#### Boolean 變數
- 使用 "is", "has", "can" 等前綴。

```javascript
const isVisible = true;
const hasPermission = false;
const canEdit = true;

```
#### 組件 Props
- 在聲明 props 時使用 camelCase。
- 模板中使用 kebab-case。
```
<script setup>
const props = defineProps({
  userRole: String,
  isAdmin: Boolean
})
</script>

<template>
  <MyComponent :user-role="role" :is-admin="admin" />
</template>
```
#### 私有變數
- 使用下劃線前綴表示私有變數或方法。
```vue
class User {
  constructor(name) {
    this._name = name;
  }

  _privateMethod() {
    // ...
  }
}
```
#### 其他變數命名建議
- 陣列命名使用複數名詞

#### 常數使用規範
- 使用大寫蛇形命名法（UPPER_SNAKE_CASE）。
- 名稱應清晰描述常數的用途。
- 將全域常數定義在單獨的文件中，例如 constants.js。
- 模組特定的常數應定義在相關模組的頂部。
```
// constants.js
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['jpg', 'png', 'pdf'];

// userModule.js
import { MAX_FILE_SIZE } from './constants';

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

// 使用常數
function uploadFile(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds limit');
  }
  // ...
}
```
#### 一定不可被修改的物件常數，使用 Object.freeze()
- 對於物件常數，如果不應該被修改，使用 Object.freeze() 以防止修改。
- 淺凍結：Object.freeze() 只能淺凍結對象。如果對象包含嵌套對象，那麼嵌套對象的屬性仍然可以被修改。
- *注意: Object.freeze 對於大型對象或頻繁訪問的對象，可能會稍微影響性能，但如果是不需要被響應的常數，使用 Object.freeze 可以保護常數不被改變之外，也讓 Vue 不需要對這樣的常數設定監聽器，反而稍微提高性能*
```
const config = Object.freeze({
    API_URL: 'https://api.example.com',
    MAX_RETRIES: 3,
    TIMEOUT: 5000
});

// 嘗試修改
config.API_URL = 'https://new-api.example.com'; // 在嚴格模式下會拋出錯誤
console.log(config.API_URL); // 仍然是 'https://api.example.com'

// 嘗試添加新屬性
config.NEW_PROP = 'test'; // 在嚴格模式下會拋出錯誤
console.log(config.NEW_PROP); // undefined

//在非嚴格模式下，嘗試修改凍結對象不會拋出錯誤，但修改不會生效。在嚴格模式下，這些操作會拋出 TypeError。
```
#### 在組件中使用常數
- 將頻繁使用的值定義為組件級別的常數。
```
<script setup>
const ITEMS_PER_PAGE = 10;
const REFRESH_INTERVAL = 60000; // 60 seconds

// 使用這些常數
</script>
```

### 組件開發

##### 組件命名
- 使用 PascalCase 命名組件檔案和組件名稱。
- 在 template 中使用 PascalCase 引用組件，而不是 kebab-case。
- 基礎組件：使用 "Base" 前綴，如 BaseButton, BaseInput
- 應用級組件：使用 "App" 前綴，如 AppHeader, AppFooter
- 自定義/重新包裝的第三方組件：使用 "Custom" 前綴或項目特定前綴，如 CustomDataTable 或 ProjectDataTable
- 專案特定組件：可以使用項目名或功能描述作為前綴，如 AdminUserList, EcommerceCart

```vue
<!-- 正確 -->
<script setup>
import BaseButton from '@/components/BaseButton.vue'
import CustomDataTable from '@/components/CustomDataTable.vue'
import AppFooter from '@/components/AppFooter.vue'

<template>
  <BaseButton @click="submit">提交</BaseButton>
    <CustomDataTable :data="tableData" />
    <AppFooter />
</template>
</script>

<!-- 避免 -->
<script setup>
import myButton from './myButton.vue'
</script>

<template>
  <my-button />
</template>

```

##### 組件結構
- 使用 `<script setup>` 語法。
- 利用組合式 API (Composition API) 組織邏輯。
- 組件 props 應該使用 camelCase 命名，在模板中使用 kebab-case。

```vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  initialCount: Number
})

const count = ref(props.initialCount)
const doubleCount = computed(() => count.value * 2)

const increment = () => {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```
##### 狀態管理
- 使用 Pinia 進行狀態管理。
- 將 store 模塊化，每個功能區域使用獨立的 store。

```vue
// stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    isLoggedIn: false
  }),
  actions: {
    login(userData) {
      this.currentUser = userData
      this.isLoggedIn = true
    },
    logout() {
      this.currentUser = null
      this.isLoggedIn = false
    }
  }
})

// component.vue
<script setup>
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// 現在你可以使用這些 store 來訪問和修改狀態
</script>

<template>
  <div v-if="userStore.isLoggedIn">
    Welcome, {{ userStore.currentUser.name }}!
  </div>
  <!-- 其他模板內容 -->
</template>
```
##### 路由管理
- 使用 Vue Router 管理路由。
- 實現懶加載以提高性能。

```vue
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('@/views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```
##### 樣式管理
- 使用 SCSS 作為預處理器。
- 採用 CSS Module 或 scoped style 來避免樣式污染。
- 遵循 UIUX 所提供的 UI 設計規範
```vue
<style scoped lang="scss">
.button {
  &--primary {
    background-color: $primary-color;
  }
}
</style>
```