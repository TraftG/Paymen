import express from "express";
import { Bot } from "grammy";
import cors from "cors";
import fs from "fs";
import https from "https";

const app = express();

// Используем динамический порт
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Инициализация бота с токеном
const bot = new Bot('6392442670:AAFxIkX7YW76odBJuX1_xXNhKPcnzWrOL3U'); 

// Хранение информации о платных пользователях (в памяти для простоты)
const paidUsers = new Map();

// Добавление обработчика для главной страницы
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

// Обработка успешных платежей
bot.on("message", (ctx) => {
  const successfulPayment = ctx.message?.successful_payment;
  if (successfulPayment) {
    // Сохранение информации о платном пользователе
    paidUsers.set(
      ctx.from.id,
      successfulPayment.telegram_payment_charge_id
    );

    console.log("Платеж успешен:", successfulPayment);

    // Отправляем ответ пользователю
    return ctx.reply("Спасибо за ваш платеж! Ваша покупка завершена.");
  }
});

// Обработка команды "/status", чтобы проверить статус платежа
bot.command("status", (ctx) => {
  const message = paidUsers.has(ctx.from.id)
    ? "Вы оплатили."
    : "Вы еще не оплатили.";
  return ctx.reply(message);
});

// Генерация ссылки для счета
app.get("/pack-invoice", async (req, res) => {
  const title = "Starter Pack";
  const description = "Starter Pack";
  const payload = "{}";
  const currency = "XTR";
  const prices = [{ amount: 100, label: "Starter Pack" }];

  try {
    const invoiceLink = await bot.api.createInvoiceLink(
      title,
      description,
      payload,
      "", // Поставьте токен провайдера пустым для Telegram Stars
      currency,
      prices
    );

    const paymentId = 'some-generated-payment-id'; // Замените на реальную логику
    res.json({ invoiceLink, paymentId });
  } catch (error) {
    res.status(500).json({ error: 'Не удалось сгенерировать ссылку для счета' });
  }
});

// Убедитесь, что webhook отключен перед запуском long polling
bot.api.deleteWebhook().then(() => {
  // Запуск бота с long polling
  bot.start();
});

// Создание HTTPS сервера
https.createServer(
  {
    key: fs.readFileSync('./src/.cert/192.168.1.65-key.pem'), // Указываем путь к приватному ключу
    cert: fs.readFileSync('./src/.cert/192.168.1.65.pem'), // Указываем путь к сертификату
  },
  app
).listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
