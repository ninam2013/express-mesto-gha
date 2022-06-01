const express = require('express');
const mongoose = require('mongoose');
// библиотека проверки на соответствие
const { celebrate, Joi, errors } = require('celebrate');

const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./error/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();
// присоединяем к localhost:27017
mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

// обязательно должно быть!!! без этого не работает
app.use(express.json());

// создаем два обработчика
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// добавляем авторизацию
app.use('/users', auth, users);
app.use('/cards', auth, cards);

// обработчики ошибок предварительной валидации
app.use(errors());

// запрос к несуществующему роуту
app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

// централизованная обработка ошибок
app.use('*', (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'На сервере произошла ошибка.';

  res.status(status).send({
    err,
    message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
