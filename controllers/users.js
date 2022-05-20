// импортируем модель
const User = require('../models/user');

const getUsers = (_, res) => {
  // все пользователи
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const returnUser = (req, res) => {
  // возвращаем пользователя по _id
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // создаём пользователя
  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports = {
  getUsers,
  returnUser,
  createUser,
};
