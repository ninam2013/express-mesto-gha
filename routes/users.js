const router = require('express').Router();

const {
  getUsers,
  returnUser,
  updateProfile,
  updateAvatar,
  returnProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', returnUser);

router.get('/me', returnProfile);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
