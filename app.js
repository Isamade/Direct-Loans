const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Img = require('./models/Image');

//const { request } = require('express');
const app = express();
dotenv.config();
connectDB();

/*User.find({email: 'kisamade999@yahoo.com'}, function(err, results){
    if(err) throw err;
    console.log(results);
});
User.findByIdAndDelete('5f9bce58591ed502f41a7e96', function(err, doc){
    if(err) throw err;
    console.log(doc);
});*/

/*User.deleteMany({__v: 0}, function(err, results){
    if(err) throw err;
    console.log(results)
});*/
/*Img.find({}, function(err, results){
    if (err) throw err;
    console.log(results);
})*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));