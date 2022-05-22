// импортируем модель
const User = require('../models/user');

const getUsers = (_, res) => {
  // все пользователи
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};

const returnUser = (req, res) => {
  // возвращаем пользователя по _id
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
  }
  // создаём пользователя
  return User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(400).send({ message: `${fields} заполнено не верно ` });
      }
      if (err.code === '11000') {
        return res.status(409).send({ message: 'Такой пользователь есть в базе данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateProfile = (req, res) => {
  // обнавляем данные пользователя по _id
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные обновления пользователя или профиля' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateAvatar = (req, res) => {
  // обнавляем аватар по _id
  const { avatar } = req.body;
  // 2 { new: true }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Аватар не найден' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные обновления аватара пользователя' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports = {
  getUsers,
  returnUser,
  createUser,
  updateProfile,
  updateAvatar,
};
