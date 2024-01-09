const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie')
  //     .split(';')[0]
  //     .trim()
  //     .split('=')[1] === 'true';
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User
      .findById('659c7fe3abb86dd308b07d1c')
      .then((user) => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => {
          console.log(err);
          res.redirect('/');
        });
        res.redirect('/');
      })
      .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
