const path = require("path")
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const compression = require("compression")
    // define routes

const userRoutes = require('./Routes/user/user')
console.log(process.env.NODE_ENV)
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Public')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET , POST , PUT , PATCH , DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
    next()
})

app.use('/user', userRoutes);
app.use(compression());
mongoose.connect('mongodb+srv://eslam:zXL0RmrtxAAMgCls@cluster0.twzmg.mongodb.net/stadium-reservation?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started on port`);
        });
    }).catch(err => {
        console.log(err)
    })