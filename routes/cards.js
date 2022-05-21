const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likesCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardsId', deleteCard);

router.put('/:cardId/likes', likesCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
