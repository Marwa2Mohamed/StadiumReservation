const path = require("path");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require("compression");


    
// define routes
const authRoutes = require('./Routes/auth/auth')
const userRoutes = require('./Routes/user/user')
const playerRoutes = require('./Routes/user/player')
const ownerRoutes = require('./Routes/user/owner')
const playgrundRoutes = require('./Routes/playground/playground')


// user modules
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));
app.use('/products_images',express.static('products_images')); // parses the /products_images to read image files
app.use(compression());


//CROS origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET , POST , PUT , PATCH , DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
    next()
})


//use main routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/player', playerRoutes);
app.use('/owner', ownerRoutes);
app.use('/playground', playgrundRoutes);



//handle error
app.use((req, res, next) => {
    const error = new Error("Not Found!")
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})


//mongodb connection
mongoose.connect('mongodb+srv://marwa:S6kGUWjCjWmbhKRJ@cluster0.twzmg.mongodb.net/stadium-reservation?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true })
    .then(() => {
        app.listen(PORT, () => {
        
            console.log(`Server started on port`);
        });
    }).catch(err => {
        console.log(err)
    })
