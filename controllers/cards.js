// импортируем модель
const Card = require('../models/card');
const {
  ERROR_CODE_200,
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/constants');

const getCards = (_, res) => {
  // все карточки
  Card.find({})
    .then((cards) => res.status(ERROR_CODE_200).send({ cards }))
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  // записываем в константу строку id пользователя
  const owner = req.user._id;
  if (!name || !link || !owner) {
    res.status(ERROR_CODE_400).send({ message: 'переданы некорректные данные создания карточки' });
  }
  // создаём карточку
  Card.create({ name, link, owner })
    // вернём записанные в базу данные
    .then((card) => res.status(ERROR_CODE_200).send({ data: card }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Поле name заполнено не верно' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  // удаляем карточку по _id
  Card.findByIdAndRemove(req.params.cardsId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_404).send({ message: 'карточка не найдена' });
      }
      return res.status(ERROR_CODE_200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const likesCard = (req, res) => {
  // добавление лайка карточки
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_404).send({ message: 'карточка не найдена' });
      }
      return res.status(ERROR_CODE_200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  // дизлайк карточки
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_404).send({ message: 'карточка не найдена' });
      }
      return res.status(ERROR_CODE_200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likesCard,
  dislikeCard,
};
