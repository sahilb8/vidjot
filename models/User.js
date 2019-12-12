const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required:true,
    },
    date:{
        type: Date,
        default:Date.now
    }
});

//we are creating the model here.
//we will call this schema ideas and it will be connected to IdeaSchema
mongoose.model('users',UserSchema);