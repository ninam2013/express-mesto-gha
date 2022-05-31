const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  returnUser,
  updateProfile,
  updateAvatar,
  returnProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', returnProfile);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), returnUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
  }),
}), updateAvatar);

module.exports = router;
