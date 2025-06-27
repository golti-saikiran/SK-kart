const express = require('express');
const connectDB = require('./Config/connectDB')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const UserRouter = require('./Routes/userRoutes')
const ProductRouter = require('./Routes/productRoutes')
const OrderRouter = require('./Routes/orderRoutes');
const CategoryRouter = require('./Routes/categoryRoutes')
const subCategoryRoutes = require('./Routes/subcategoryRoutes')
const AddressRoutes = require('./Routes/addressRoutes')
const uploadImageRoutes = require('./Routes/uploadImageRoutes')

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_PROD,
];
app.use('/uploads', express.static('uploads'));
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from Express on Vercel!");
});
app.use('/api/user', UserRouter)
app.use('/api/category', CategoryRouter)
app.use('/api/subcategory', subCategoryRoutes)
app.use('/api/product', ProductRouter)
app.use('/api/order', OrderRouter)
app.use('/api/address', AddressRoutes)
app.use('/api/upload', uploadImageRoutes)

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: 'Internal server error' });
});


const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, (err) => {
      if (err) {
        console.log('Some error occured to run the express server, please try again...')
      } else {
        console.log(`Backend started running in the ${PORT} `)
      }
    })
  })


