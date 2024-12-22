import express from "express";
import { Bot } from "grammy";
import cors from "cors";

const app = express();

// Use Render's dynamic port
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const bot = new Bot('6392442670:AAFxIkX7YW76odBJuX1_xXNhKPcnzWrOL3U'); // Ваш токен бота

// Храним список оплаченных пользователей (для примера в памяти, в продакшн используйте базу данных)
const paidUsers = new Map();

// Добавление обработчика для главной страницы
app.get("/", (req, res) => {
  res.send("Сервер работает!");
});

// Обработка pre_checkout_query для подтверждения заказа
bot.on("pre_checkout_query", (ctx) => {
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.error("answerPreCheckoutQuery не удалось выполнить");
  });
});

// Обработка успешного платежа
bot.on("message", (ctx) => {
  const successfulPayment = ctx.message?.successful_payment;
  if (successfulPayment) {
    // Сохранение информации о платеже
    paidUsers.set(
      ctx.from.id,
      successfulPayment.telegram_payment_charge_id
    );

    console.log("Платеж успешен:", successfulPayment);

    // Вы можете отправить ответ пользователю
    return ctx.reply("Спасибо за ваш платеж! Ваша покупка завершена.");
  }
});

// Обработка команды "/status" для проверки статуса платежа
bot.command("status", (ctx) => {
  const message = paidUsers.has(ctx.from.id)
    ? "Вы оплатили."
    : "Вы еще не оплатили.";
  return ctx.reply(message);
});

// Обработка команды "/refund" для обработки возврата средств
bot.command("refund", (ctx) => {
  const userId = ctx.from.id;
  if (!paidUsers.has(userId)) {
    return ctx.reply("Вы еще не оплатили, нечего возвращать.");
  }

  // Логика возврата средств (пример, при необходимости подкорректируйте)
  bot.api
    .refundStarPayment(userId, paidUsers.get(userId)) // Пример метода возврата
    .then(() => {
      paidUsers.delete(userId); // Удаляем пользователя из списка оплаченных
      return ctx.reply("Возврат успешен.");
    })
    .catch(() => ctx.reply("Возврат не удался. Попробуйте снова позже."));
});

// Генерация ссылки для счета
app.get("/generate-invoice", async (req, res) => {
  const title = "Starter Pack Dude";
  const description = "Starter Pack Dude";
  const payload = "{}";
  const currency = "XTR";
  const prices = [{ amount: 50, label: "Starter Pack" }];

  try {
    const invoiceLink = await bot.api.createInvoiceLink(
      title,
      description,
      payload,
      "", // Токен провайдера для Telegram Stars пустой
      currency,
      prices
    );

    const paymentId = 'some-generated-payment-id'; // Замените на реальную логику
    res.json({ invoiceLink, paymentId });
  } catch (error) {
    res.status(500).json({ error: 'Не удалось создать ссылку для счета' });
  }
});

// Обработка pre_checkout_query для подтверждения заказа
bot.on("pre_checkout_query", (ctx) => {
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.error("answerPreCheckoutQuery не удалось выполнить");
  });
});

// Обработка успешного платежа
bot.on("message", (ctx) => {
  const successfulPayment = ctx.message?.successful_payment;
  if (successfulPayment) {
    // Сохранение информации о платеже
    paidUsers.set(
      ctx.from.id,
      successfulPayment.telegram_payment_charge_id
    );

    console.log("Платеж успешен:", successfulPayment);

    // Вы можете отправить ответ пользователю
    return ctx.reply("Спасибо за ваш платеж! Ваша покупка завершена.");
  }
});

// Обработка команды "/status" для проверки статуса платежа
bot.command("status", (ctx) => {
  const message = paidUsers.has(ctx.from.id)
    ? "Вы оплатили."
    : "Вы еще не оплатили.";
  return ctx.reply(message);
});

// Обработка команды "/refund" для обработки возврата средств
bot.command("refund", (ctx) => {
  const userId = ctx.from.id;
  if (!paidUsers.has(userId)) {
    return ctx.reply("Вы еще не оплатили, нечего возвращать.");
  }

  // Логика возврата средств (пример, при необходимости подкорректируйте)
  bot.api
    .refundStarPayment(userId, paidUsers.get(userId)) // Пример метода возврата
    .then(() => {
      paidUsers.delete(userId); // Удаляем пользователя из списка оплаченных
      return ctx.reply("Возврат успешен.");
    })
    .catch(() => ctx.reply("Возврат не удался. Попробуйте снова позже."));
});

// Генерация ссылки для счета
app.get("/pack-invoice", async (req, res) => {
  const title = "Starter Pack Expert";
  const description = "Starter Pack Expert";
  const payload = "{}";
  const currency = "XTR";
  const prices = [{ amount: 100, label: "Starter Pack" }];

  try {
    const invoiceLink = await bot.api.createInvoiceLink(
      title,
      description,
      payload,
      "", // Токен провайдера для Telegram Stars пустой
      currency,
      prices
    );

    const paymentId = 'some-generated-payment-id'; // Замените на реальную логику
    res.json({ invoiceLink, paymentId });
  } catch (error) {
    res.status(500).json({ error: 'Не удалось создать ссылку для счета' });
  }
});


// Старт бота
bot.start();

// Запуск express-сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
