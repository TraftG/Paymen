import { Telegraf, Markup } from 'telegraf'

const token = '6392442670:AAFxIkX7YW76odBJuX1_xXNhKPcnzWrOL3U'
const webAppUrl = 'https://lizard-clicker-pro.web.app'

const bot = new Telegraf(token)

bot.command('start', (ctx) => {
  ctx.reply(
    'Hello! Press to start the app',
    Markup.inlineKeyboard([
      Markup.button.webApp('Open mini app', `${webAppUrl}?ref=${ctx.payload}`),
    ])
  )
})

bot.launch()
