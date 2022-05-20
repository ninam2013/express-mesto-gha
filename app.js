const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
// const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

// обязательно!!! без этого не работает
app.use(express.json());

app.use('/', users);
// app.use('/users', cards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
