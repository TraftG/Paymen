<template>
    <div>
      <button @click="initiatePurchase">Купить</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    methods: {
      async initiatePurchase() {
        try {
          // Отправка запроса на создание платежа
          const response = await axios.post('http://localhost:5137/api/payments', {
            item_id: 123,  // ID товара
            amount: 1000,  // Сумма
            description: 'Test purchase',  // Описание
            chat_id: 'Правильный_chat_id',  // Полученный chat_id
        });


          console.log('Ответ от сервера:', response.data);  // Выводим ответ
        } catch (error) {
          console.error('Ошибка:', error);  // Обработка ошибок
        }
      },
    },
  };
  </script>
  