# wv_demo

## Project setup
```
pnpm install  //project setup
pnpm run serve // compiles and hot-reloads for dev
pnpm run build // compiles and minifies for prod
pnpm run lint // lints and fixes files
```

## 專案目錄結構
```
src/
|-- assets/
|-- components/
|-- views/
|-- router/
|-- store/
|-- services/
|-- utils/
|-- styles/
|-- App.vue
|-- main.js


```
## 目錄說明

### assets/
存放靜態資源，如圖片、字體等。

### components/
可重用的 Vue 組件。應該進一步按功能或特性分類。

### views/
頁面級別的 Vue 組件，通常與路由對應。

### router/
路由相關的配置文件。
- `index.js`: 主要路由配置文件

### store/
Vuex 狀態管理相關文件。
- `index.js`: Vuex store 的主文件
- 可能還包含模塊化的 store 文件

### services/
與後端 API 通信的服務。
- 可以按照 API 的不同領域進行分類

### utils/
通用的工具函數。

### styles/
全局樣式文件。
- 可能包含 SCSS 變量、mixins、重置樣式等

### App.vue
應用的根組件。

### main.js
應用的入口文件，用於初始化 Vue 應用和插件。
