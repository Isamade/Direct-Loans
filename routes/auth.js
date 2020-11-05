const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require('fs'); 
const multer = require('multer');

const auth = require('../middleware/auth');
const User = require('../models/User');
const Img = require('../models/Image');
  
const storage = multer.diskStorage({ 
    destination: '/uploads', 
    filename: (req, file, cb) => {
        cb(null, 'pic') 
    } 
}); 
  
const upload = multer({ storage });

router.get('/:name/image', async (req, res) => {
  try {
    const img = await Img.find({name: req.params.name});
    if(img.length !== 0){
      fs.writeFileSync(`/uploads/${req.params.name}.jpg`, img[0].avatar.data, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("The file was saved!");
      })
      res.sendFile(`/uploads/${req.params.name}.jpg`);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/', auth,
  upload.single('avatar'),
  async (req, res) => {
    const filterObj = (obj, ...allowedFields) => {
      const newObj = {};
      Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
      });
      return newObj;
    };
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    try {
    const body = JSON.parse(req.body.body);

    if(req.file) {
      const owner = await User.find({_id: req.user.id});
      const pic = await Img.find({name: owner[0].name});
      if(pic.length === 0){
          await Img.create({
            name: body.name,
            avatar: {
              data: fs.readFileSync('\\uploads\\pic'),
              contentType: 'image/jpeg'
            }
        })
      } else {
        pic[0].name = body.name;
        pic[0].avatar = {
          data: fs.readFileSync('\\uploads\\pic'),
          contentType: 'image/jpeg'
        };
        await pic[0].save();
      }
    }

    const filteredBody = body.password ?  
    filterObj(body, 'name', 'email', 'companyEmail', 'phone', 'password', 'description', 'interestRate', 'duration', 'maxAmount', 'website')
    : filterObj(body, 'name', 'email', 'companyEmail', 'phone', 'description', 'interestRate', 'duration', 'maxAmount', 'website');
    if(filteredBody.password) {
      const password = filteredBody.password;
      const salt = await bcrypt.genSalt(10);
      filteredBody.password = await bcrypt.hash(password, salt);
    }

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch(err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({status: 'success'});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

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