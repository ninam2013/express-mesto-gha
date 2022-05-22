const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { ERROR_CODE_404 } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

// обязательно должно быть!!! без этого не работает
app.use(express.json());

// заглушка временная
app.use((req, _, next) => {
  req.user = {
    // здесь _id созданного пользователя
    _id: '62868b1326c4e504695519fa',
  };

  next();
});

app.use('/users', users);
app.use('/cards', cards);

// переход на несуществующий роут
app.use((_, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница отсутствует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// Временно
module.exports.createCard = (req) => {
  console.log(req.user._id);
};
