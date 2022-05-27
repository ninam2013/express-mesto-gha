const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// описываем схему
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  // 1
  email: {
    type: String,
    required: true,
    unique: true,
    // https://mongoosejs.com/docs/validation.html Пользовательские валидаторы
    validate: {
      validator: (v) => {
        validator.isEmail(v);
      },
      message: 'is not a valid email!',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

// добавим метод
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

// создаём модель
module.exports = mongoose.model('user', userSchema);
