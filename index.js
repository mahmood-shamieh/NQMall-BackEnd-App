const path = require('path')
const express = require('express');
const app = express();





const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require('./routes/user.routes')
const categoryRouter = require('./routes/category.routes')
const brandRouter = require('./routes/brand.routes')
const mediaRouter = require('./routes/media.routes')
const productRoutes = require('./routes/product.routes')
const attributeRoutes = require('./routes/attribute.routes')

const User = require('./models/user.model')
const Category = require('./models/category.model');
const Product = require('./models/product.model')
const Attribute = require('./models/attribute.model')
const Cart = require('./models/cart.model')
const Rating = require('./models/rating.model')
const Brand = require('./models/brand.model')
const Media = require('./models/media.model')
const sequelize = require('./config/sequelize.config')

// relations
User.hasOne(Cart);
User.hasMany(Rating);
User.hasMany(Product);

Rating.belongsTo(User);
Cart.belongsTo(User);
Product.belongsTo(User);

Product.hasMany(Attribute, { onDelete: "CASCADE" });
Product.hasMany(Rating, { onDelete: "CASCADE" });
Product.hasMany(Media, { onDelete: "CASCADE" });
Category.hasMany(Product);
Brand.hasMany(Product);

Attribute.belongsTo(Product,);
Product.belongsTo(Brand);
Product.belongsTo(Category);
Rating.belongsTo(Product);

Product.belongsToMany(Cart, { through: "cart_product" });

Media.belongsTo(Product);
// end relations
sequelize.sync();





var corsOptions = {
    origin: "http://localhost:8080"

};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', userRoutes);
app.use('/category', categoryRouter);
app.use('/brands', brandRouter);
app.use('/media', mediaRouter);
app.use('/products', productRoutes);
app.use('/attributes', attributeRoutes);

// app.post('/test', upload.array('file'), (req, res) => {
//     const response = [];
//     req.files.forEach(element => {

// response.push( {
//     fileName: element.filename,
//     originalName: element.originalname,
//     filePath: element.path,
//     fileSize: element.size
// });


//     })
//     res.status(200).json(response);
// })
app.listen(8080, () => {
    console.log(`Server is running on port ${8080}.`);
});
