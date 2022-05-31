const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likesCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
  }),
}), createCard);

router.delete('/:cardsId', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
}), likesCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardsId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
