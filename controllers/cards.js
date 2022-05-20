// импортируем модель
const Card = require('../models/card');

const getCards = (_, res) => {
  // все карточки
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  // создаём карточку
  Card.create({ name, link })
    // вернём записанные в базу данные
    .then((card) => res.send({
      // возможно достаточно просто card???
      name: card.name,
      link: card.link,
    }))
    // данные не записались, вернём ошибку
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const deleteCard = (req, res) => {
  // удаляем карточку по _id
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
