// импортируем модель
const Card = require('../models/card');

const getCards = (_, res) => {
  // все карточки
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на сервере' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  // записываем в константу строку id пользователя
  const ownerId = req.user._id;
  // создаём карточку
  Card.create({ name, link, owner: ownerId })
    // вернём записанные в базу данные
    .then((card) => {
      if (!card) {
        return res.status(400).send({ message: 'переданы некорректные данные создания карточки' });
      }
      return res.send({
        // возможно достаточно просто card???
        name: card.name,
        link: card.link,
      });
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Поле name заполнено не верно' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const deleteCard = (req, res) => {
  // удаляем карточку по _id
  Card.findByIdAndRemove(req.params.cardsId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'карточка не найдена' });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const likesCard = (req, res) => {
  // добавление лайка карточки
  Card.findByIdAndUpdate(
    req.params.cardsId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'карточка не найдена' });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  // дизлайк карточки
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'карточка не найдена' });
      }
      return res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likesCard,
  dislikeCard,
};
