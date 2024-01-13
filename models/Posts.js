const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    itemName:{
        type: String,
        required: true
    },
    collectFrom:{
        type : String,
        required: true
    },
    image:{
        data: Buffer,
        type: String,
    //Todo add image as required

        // required: true
    },
    contact:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
    description:{
        type: String
    },
});

module.exports = mongoose.model('post',PostSchema);
//This is the schema of the post that user will post