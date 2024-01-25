const bcrypt = require('bcryptjs'); ;
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie')
  //     .split(';')[0]
  //     .trim()
  //     .split('=')[1] === 'true';
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User
      .findOne({email: email})
      .then((user) => {
        if (!user) {
          return res.redirect('/auth/login');
        }
        bcrypt
            .compare(password, user.password)
            .then((doMatch) => {
              if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session
                    .save((err) => {
                      console.log(err);
                      res.redirect('/');
                    });
              }
              res.redirect('/auth/login');
            })
            .catch((err) => {
              console.log(err);
              res.redirect('/auth/login');
            });
      })
      .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password !== confirmPassword) {
    console.log('Password do not match!');
  }
  User.findOne({email: email})
      .then((userDoc) => {
        if (userDoc) {
          return res.redirect('/auth/signup');
        }
        return bcrypt
            .hash(password, 12)
            .then((hashedPassword) => {
              const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                cart: {items: []},
              });

              return user.save();
            })
            .then((_) => {
              res.redirect('/auth/login');
            })
            .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
};