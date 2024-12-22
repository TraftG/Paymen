import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

import {
    createTonConnectUIProvider,
    TonConnectUIContext,
    TonConnectUIOptionsContext
} from 'ton-ui-vue';

// Инициализация TonConnect
const { tonConnectUI, setOptions } = createTonConnectUIProvider({
    manifestUrl: 'https://clicker-35e7c.web.app/manifest.json'
});

// Создание приложения Vue
const app = createApp(App);
const pinia = createPinia();

// Подключение Pinia и маршрутизации
app.use(pinia);
app.use(router);


// Предоставление TonConnect контекста
app.provide(TonConnectUIContext, tonConnectUI);
app.provide(TonConnectUIOptionsContext, setOptions);

// Монтирование приложения
app.mount('#app');
