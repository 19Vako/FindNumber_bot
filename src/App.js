import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userGuess, setUserGuess] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [find, setFind] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    // Подключение к Telegram Web App API
    const tg = window.Telegram.WebApp;

    // Отправка данных в Telegram
    const sendDataToTelegram = () => {
      tg.sendData(JSON.stringify({ data: result }));
    };

    // Настройка кнопки в Telegram
    tg.MainButton.setText('Отправить данные в Telegram');
    tg.MainButton.onClick(sendDataToTelegram);
    tg.MainButton.show();

    // Очистка эффекта при размонтировании компонента
    return () => {
      tg.MainButton.offClick(sendDataToTelegram);
      tg.MainButton.hide();
    };
  }, [result]);

  // Функция для начала новой игры
  const startGame = async () => {
    try {
      const response = await axios.post('https://c12e-31-43-49-202.ngrok-free.app/start_game'); // Используйте полный URL
      setResult(response.data.message);
      setGameStarted(true);
      setFind(false); // Сбрасываем состояние при начале новой игры
      setError('');
      setUserGuess('')

    } catch (error) {
      console.error('Ошибка при запуске игры:', error);
      setError('Ошибка при запуске игры. Попробуйте снова.');
    }
  };

  // Функция для проверки числа пользователя
  const checkNumber = async () => {
    const guess = parseInt(userGuess, 10);

    if (isNaN(guess)) {
      setError('Введите корректное число');
      return;
    }
    
    try {
      const response = await axios.post('https://c12e-31-43-49-202.ngrok-free.app/guess', { number: guess }); // Используйте полный URL
      setResult(response.data.message);
      
      if (response.data.message.includes('Число угадано')) {
        setFind(true); // Устанавливаем состояние успешного угадывания
        setGameStarted(false); // Останавливаем игру
      }
    } catch (error) {
      console.error('Ошибка при проверке числа:', error);
      setError('Ошибка при проверке числа. Попробуйте снова.');
    }
    setError('');
  };

  // Обработка ввода пользователя
  const handleInputChange = (e) => {
    setUserGuess(e.target.value);
  };

  return (
    <div className='container'>
      {!gameStarted && !find ? (
        <button className='startButton' onClick={startGame}>Начать игру</button>
      ) : find ? (
        <div className='successScreen'>
          <h1>Поздравляем!</h1>
          <p>Вы угадали число!</p>
          <button className='successtButton' onClick={startGame}>Начать новую игру</button>
        </div>
      ) : (
        <>
          <h1>Вгадай число</h1>
          {result && 
          <div className='showResult'>
            <h1>{result}</h1>
          </div>}
          <input
            id='input'
            className='input'
            type='number'
            value={userGuess}
            onChange={handleInputChange}
          />
          <button id='CheckNumber' onClick={checkNumber}>
            Проверить число
          </button>
        </>
      )}
      {error && <div className='error'>{error}</div>}
    </div>
  );
}

export default App;
