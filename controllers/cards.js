// импортируем модель
const Card = require('../models/card');
const BadRequestError = require('../error/BadRequestError');
const ForbiddenError = require('../error/ForbiddenError');
const NotFoundError = require('../error/NotFoundError');

const ERROR_CODE_200 = 200;

const getCards = (_, res, next) => {
  // все карточки
  Card.find({})
    .then((cards) => res.status(ERROR_CODE_200).send({ cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  // записываем в константу строку id пользователя
  const owner = req.user._id;
  if (!name || !link || !owner) {
    return next(new BadRequestError('переданы некорректные данные создания карточки'));
  }
  // создаём карточку
  return Card.create({ name, link, owner })
    // вернём записанные в базу данные
    .then((card) => res.status(ERROR_CODE_200).send({ data: card }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Поле name заполнено не верно'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  // ищем карточку по _id
  Card.findOne({ _id: req.params.cardsId })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (req.user._id !== card.owner.toString()) {
        return next(new ForbiddenError('Нет прав на удаление'));
      }
      // удаляем карточку по _id
      return Card.findByIdAndRemove(req.params.cardsId)
        .then((cardData) => {
          res.status(ERROR_CODE_200).send({ cardData });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      return next(err);
    });
};

const likesCard = (req, res, next) => {
  // добавление лайка карточки
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.status(ERROR_CODE_200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  // дизлайк карточки
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.status(ERROR_CODE_200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likesCard,
  dislikeCard,
};
