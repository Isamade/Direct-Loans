const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require('fs'); 
const multer = require('multer'); 
  
const storage = multer.diskStorage({ 
    destination: '/uploads', 
    filename: (req, file, cb) => { 
        cb(null, 'pic') 
    } 
}); 
  
const upload = multer({ storage });

const User = require('../models/User');
const Img = require('../models/Image');

router.get('/', async (req, res) => {
  try {
    let users = await User.find().select('-password');;
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/signUp',
  upload.single('avatar'),
  async (req, res) => {
    const { name, email, companyEmail, phone, password, description, interestRate, duration, maxAmount, website } = JSON.parse(req.body.body);

    try {
      let user = await User.findOne({ name });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      if (req.file) {
        const obj = {
          name,
          avatar: {
            data: fs.readFileSync('\\uploads\\pic'),
            contentType: 'image/jpeg'
          }
        }

        await Img.create(obj);
      }

      user = new User({
        name,
        email,
        companyEmail,
        phone,
        password,
        description,
        interestRate,
        duration,
        maxAmount,
        website
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

