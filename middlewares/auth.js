// подключаем для создание токена
const jwt = require('jsonwebtoken');

const ERROR_CODE_401 = 401;

// авторизация запросов
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  // если заголовка нет или он не начинается с Bearer-вылаем ошибку
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_CODE_401).send({ message: 'Необходима авторизация' });
  }
  // если токен на месте извлечём приставку Bearer и запишется только JWT
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // Проверяем токена, если токен прошёл проверку вернётся пейлоуд
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res.status(ERROR_CODE_401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
