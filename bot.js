const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const bodyParser = require('body-parser');

const TOKEN = '7526058177:AAH1j363GCGJ_yA25VCXpdXH27rUwuTPk4k';
const bot = new TelegramBot(TOKEN, { polling: true });

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Устанавливаем заголовок для пропуска предупреждения ngrok
app.use((req, res, next) => {
  console.log('Setting ngrok-skip-browser-warning header');
  res.setHeader('ngrok-skip-browser-warning', 'true');
  next();
});

app.use(express.static(path.join(__dirname, 'build')));

// Переменная для хранения загаданного числа в памяти
let secretNumber = null;

// Генерация случайного числа
function generateRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

// Эндпоинт для старта новой игры
app.post('/start_game', (req, res) => {
  secretNumber = generateRandomNumber();
  res.json({ message: 'Загадано число' });
});

// Эндпоинт для проверки числа пользователя
app.post('/guess', (req, res) => {
  const userGuess = req.body.number;

  if (secretNumber === null) {
    return res.status(400).json({ message: 'Игра не начата' });
  }

  if (typeof userGuess !== 'number' || isNaN(userGuess)) {
    return res.status(400).json({ message: 'Введите корректное число' });
  }

  if (userGuess === secretNumber) {
    secretNumber = null; // сбрасываем число после угадывания
    res.json({ message: 'Число угадано!' });
  } else if (userGuess < secretNumber) {
    res.json({ message: 'Загаданное число больше' });
  } else {
    res.json({ message: 'Загаданное число меньше' });
  }
});

// Обработчик команды /start для Telegram
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Привет! Нажмите на кнопку ниже, чтобы начать игру', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Играть',
            web_app: {
              url: 'https://c12e-31-43-49-202.ngrok-free.app', // Замените на ваш актуальный URL ngrok
            },
          },
        ],
      ],
    },
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on https://c12e-31-43-49-202.ngrok-free.app`); // Замените на ваш актуальный URL ngrok
});
