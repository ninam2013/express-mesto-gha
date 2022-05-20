const router = require('express').Router();

const { getUsers, returnUser, createUser } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', returnUser);

router.post('/users', createUser);

module.exports = router;
