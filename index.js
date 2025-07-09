const path = require('path')
const express = require('express');
const app = express();




const bodyParser = require("body-parser");
const cors = require("cors");
// 
const userRoutes = require('./routes/user.routes')
const categoryRouter = require('./routes/category.routes')
const brandRouter = require('./routes/brand.routes')
const mediaRouter = require('./routes/media.routes')
const productRoutes = require('./routes/product.routes')
const attributeRoutes = require('./routes/attribute.routes')
const valuesRoute = require('./routes/values.routes');
const variationRoute = require('./routes/variation.routes');
const productVariationValues = require('./routes/productVariationValues.routes');
const cartRoute = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const orderStatusRoutes = require('./routes/orderStatus.routes');
const notificationRoutes = require('./routes/notification.routes');
// 

const User = require('./models/user.model')
const Category = require('./models/category.model');
const Product = require('./models/product.model')
const Attribute = require('./models/attribute.model')
const Cart = require('./models/cart.model')
const Rating = require('./models/rating.model')
const Brand = require('./models/brand.model')
const Media = require('./models/media.model')
const Values = require('./models/values.model')
const Variations = require('./models/vairation.model')
const ProductVariationValues = require("./models/productVariationValues.model")
const CartItem = require("./models/cartItem.model")
const OrderItem = require("./models/orderItem.model")
const OrderStatus = require("./models/orderStatus.model")
const Order = require("./models/order.model")
const Section = require("./models/section.model")
const AdminPrev = require("./models/admin_prev.model")
const AppConfig = require("./models/app_config")
const { sequelize } = require('./config/sequelize.config')

// relations
User.hasOne(Cart);
User.hasMany(Rating);
User.hasMany(AdminPrev);
Section.hasMany(AdminPrev);
Attribute.hasMany(Values, { onDelete: "CASCADE" });
Values.hasMany(ProductVariationValues, { onDelete: "CASCADE" });
Variations.hasMany(ProductVariationValues, { onDelete: "CASCADE" });
Variations.hasMany(OrderItem, { onDelete: "CASCADE" });
Product.hasMany(OrderItem, { onDelete: "CASCADE" });
Order.hasMany(OrderItem, { onDelete: "CASCADE" });
User.hasMany(Order, { onDelete: "CASCADE" });
OrderStatus.hasMany(Order);
User.hasMany(Product);

Rating.belongsTo(User);
Cart.belongsTo(User);
AdminPrev.belongsTo(User);
AdminPrev.belongsTo(Section);

OrderItem.belongsTo(Variations);
OrderItem.belongsTo(Product);
Order.belongsTo(OrderStatus);
Order.belongsTo(User);


CartItem.belongsTo(Cart)
CartItem.belongsTo(Product)
CartItem.belongsTo(Variations)
Product.belongsTo(User);

Product.hasMany(Attribute, { onDelete: "CASCADE" });
Product.hasMany(Rating, { onDelete: "CASCADE" });
Product.hasMany(Media, { onDelete: "CASCADE" });
Product.hasMany(Variations, { onDelete: "CASCADE" });
Category.hasMany(Product);
Brand.hasMany(Product);

Attribute.belongsTo(Product);
Product.belongsTo(Brand);
Product.belongsTo(Category);
Rating.belongsTo(Product);

// Product.belongsToMany(Cart, { through: "cart_product" });
Cart.hasMany(CartItem)
Product.hasMany(CartItem)
Variations.hasMany(CartItem)

Media.belongsTo(Product);
Values.belongsTo(Attribute);
Variations.belongsTo(Product);

ProductVariationValues.belongsTo(Values);
ProductVariationValues.belongsTo(Variations);
// end relations
sequelize.sync({
    alter: true
});

var corsOptions = {
    origin: "http://localhost:3000"

};
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', userRoutes);
app.use('/category', categoryRouter);
app.use('/brands', brandRouter);
app.use('/media', mediaRouter);
app.use('/products', productRoutes);
app.use('/attributes', attributeRoutes);
app.use('/attributesValues', valuesRoute);
app.use('/variations', variationRoute);
app.use('/variationsLinks', productVariationValues);
app.use('/carts', cartRoute);
app.use('/orders', orderRoutes);
app.use('/orderStatus', orderStatusRoutes);
app.use('/notifications', notificationRoutes);




app.listen(3001, () => {
    console.log(`Server is running on port ${3001}.`);
});
