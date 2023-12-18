const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// bu kod sadece gelen istkler için çalışır
app.use((req, res, next) => {
  User.findByPk(1)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
// Bir sipariş bir kullanıcıya aittir
Order.belongsTo(User);
// Bir kullanıcının birden fazla siparişi olabilir
User.hasMany(Order);
// Bir siparişin birden çok ürünü olabilir bunu da ->
// ->OrderItem ara tablosu sağlar
Order.belongsToMany(Product, {through: OrderItem});

sequelize
    // .sync({force: true})
    // bu durumda veri tabanı güncellenir ancak veriler silinir
    .sync()
    .then((_) => {
      return User.findByPk(1);
    })
    .then((user) => {
      if (!user) {
        return User.create({name: 'Alp', email: 'test@test@gmail.com'});
      }
      return Promise.resolve(user);
    })
    .then((user) => {
      Cart
          .findAll({where: {userId: user.id}})
          .then((cart) => {
            if (cart.length == 0) {
              return user.createCart();
            }
            return cart;
          }).catch((err) => {
            console.log(err);
          });
      // console.log(user);
    })
    .then((cart) => {
      app.listen(3000);
    })
    .catch( (err) => {
      console.log(err);
    });

