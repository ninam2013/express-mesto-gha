const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
// 4
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { ERROR_CODE_404 } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

// обязательно должно быть!!! без этого не работает
app.use(express.json());

// создаем два обработчика
app.post('/signin', login);
app.post('/signup', createUser);
// добавляем авторизацию
app.use('/users', auth, users);
app.use('/cards', auth, cards);

// переход на несуществующий роут
app.use((_, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница отсутствует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
