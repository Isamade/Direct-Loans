const mongoose = require('mongoose'); 
  
const ImageSchema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        unique: true
    },
    avatar: { 
        data: Buffer, 
        contentType: String 
    } 
}); 
  
module.exports = Img = mongoose.model('img', ImageSchema); 