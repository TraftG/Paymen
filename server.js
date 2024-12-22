import express from "express";
import { Bot } from "grammy";
import cors from "cors";

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

const bot = new Bot('6392442670:AAFxIkX7YW76odBJuX1_xXNhKPcnzWrOL3U'); // Your bot's token

// Store paid users (in memory for now, use a database in production)
const paidUsers = new Map();

// Handle pre_checkout_query to confirm the order
bot.on("pre_checkout_query", (ctx) => {
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.error("answerPreCheckoutQuery failed");
  });
});

// Handle the successful payment
bot.on("message", (ctx) => {
  const successfulPayment = ctx.message?.successful_payment;
  if (successfulPayment) {
    // Store user payment info
    paidUsers.set(
      ctx.from.id,
      successfulPayment.telegram_payment_charge_id
    );

    console.log("Payment successful:", successfulPayment);

    // Send an HTTP request to the frontend to notify about successful payment
    const paymentData = {
      userId: ctx.from.id,
      status: 'paid',
      product: 'Basic Pack',
      amount: 5000, // Amount in the smallest currency unit (e.g., cents or XTR subunits)
    };

    console.log("Payment successful:", successfulPayment);

    // Send a thank-you message to the user
    return ctx.reply("Thank you for your payment! Your purchase has been completed.");
  }
});

// Handle the "/status" command to check payment status
bot.command("status", (ctx) => {
  const message = paidUsers.has(ctx.from.id)
    ? "You have paid."
    : "You have not paid yet.";
  return ctx.reply(message);
});

// Handle the "/refund" command to process a refund
bot.command("refund", (ctx) => {
  const userId = ctx.from.id;
  if (!paidUsers.has(userId)) {
    return ctx.reply("You have not paid yet, there is nothing to refund.");
  }

  // Refund logic (example, adjust as needed)
  bot.api
    .refundStarPayment(userId, paidUsers.get(userId)) // Example refund method
    .then(() => {
      paidUsers.delete(userId); // Remove from paid users list
      return ctx.reply("Refund successful.");
    })
    .catch(() => ctx.reply("Refund failed. Please try again later."));
});

// Invoice link generation route
app.get("/generate-invoice", async (req, res) => {
  const title = "Starter Pack Dude";
  const description = "Starter Pack Dude";
  const payload = "{}";
  const currency = "XTR";
  const prices = [{ amount: 50, label: "Starter Pack Dude" }]; // Price set to 50 units, adjust for smallest currency unit

  try {
    const invoiceLink = await bot.api.createInvoiceLink(
      title,
      description,
      payload,
      "", // Provider token must be empty for Telegram Stars
      currency,
      prices
    );

    const paymentId = 'some-generated-payment-id'; // Replace with actual logic
    res.json({ invoiceLink, paymentId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate invoice link' });
  }
});

// Start the bot
bot.start();

// Start the express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});