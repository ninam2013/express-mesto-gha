// импортируем модуль jsonwebtoken
const jwt = require('jsonwebtoken');
// импортируем bcrypt
const bcrypt = require('bcryptjs');
// импортируем модель
const User = require('../models/user');
const {
  ERROR_CODE_200,
  ERROR_CODE_201,
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_409,
  ERROR_CODE_500,
} = require('../utils/constants');

const getUsers = (_, res) => {
  // все пользователи
  User.find({})
    .then((users) => res.status(ERROR_CODE_200).send(users))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' }));
};

const returnUser = (req, res) => {
  // возвращаем пользователя по _id
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь не найден' });
      }
      return res.status(ERROR_CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

// const createUser = (req, res) => {
//   // email, password  //2
//   const { name, about, avatar } = req.body;
//   if (!name || !about || !avatar) {
//  return res.status(ERROR_CODE_400).send({message: 'Переданы некорректные данные пользователя'});
//   }
//   // создаём пользователя
//   return User.create({ name, about, avatar })
//     // вернём записанные в базу данные
//     .then((user) => res.status(ERROR_CODE_201).send({
//       name: user.name,
//       about: user.about,
//       avatar: user.avatar,
//       _id: user._id,
//       email: user.email,
//     }))
//     // данные не записались, вернём ошибку
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         const fields = Object.keys(err.errors).join(', ');
//         return res.status(ERROR_CODE_400).send({ message: `${fields} заполнено не верно ` });
//       }
//       // if (err.code === '11000') {
//       //   return res.status(409).send({ message: 'Такой пользователь есть в базе данных' });
//       // }
//       return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
//     });
// };

const createUser = (req, res) => {
  // email, password  //2
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!name || !about || !avatar || !email || !password) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные пользователя' });
  }
  // хешируем пароль
  bcrypt.hash(password, 10)
    // создаём пользователя
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    // вернём записанные в базу данные
    .then((user) => res.status(ERROR_CODE_201).send({ data: user }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return res.status(ERROR_CODE_400).send({ message: `${fields} заполнено не верно ` });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

// const createUser = (req, res) => {
//   const { name, about, avatar, email, password } = req.body;
//   console.log('email', email);
//   bcrypt.hash(password, 10)
//     .then((hash) => User.create({
//       name,
//       about,
//       avatar,
//       email,
//       // записываем хеш в базу
//       password: hash,
//     }))
//     .then((user) => {
//       console.log('user create', user);
//       res.status(ERROR_CODE_201).send({ data: user });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         const fields = Object.keys(err.errors).join(', ');
//         return res.status(ERROR_CODE_400).send({ message: `${fields} заполнено не верно ` });
//       }
//       // if (err.code === '11000') {
//       //   return res.status(409).send({ message: 'Такой пользователь есть в базе данных' });
//       // }
//       return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
//     });
// };

const updateProfile = (req, res) => {
  // обнавляем данные пользователя по _id
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь не найден' });
      }
      return res.status(ERROR_CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные обновления пользователя или профиля' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateAvatar = (req, res) => {
  // обнавляем аватар по _id
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_404).send({ message: 'Аватар не найден' });
      }
      return res.status(ERROR_CODE_200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные обновления аватара пользователя' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

// const login = (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
//     return;
//   }
//   User.findOne({ email })
//     .then((admin) => {
//       if (admin) {
//         throw new Error('user_exist');
//       }
//       return User.create({ email, password });
//     })
//     .then(() => {
//       res.status(ERROR_CODE_200).send({ message: 'Пользователь создан' });
//     })
//     .catch(() => {
//       res.status(ERROR_CODE_409).send({ message: 'Такой email уже существует' });
//     });
// };

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log('user', user);
      return res.status(ERROR_CODE_200).send({ message: 'Пользователь создан' });
    })
    .catch(() => {
      res.status(ERROR_CODE_409).send({ message: 'Такой email уже существует' });
    });
};

module.exports = {
  getUsers,
  returnUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
