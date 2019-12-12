const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    details:{
        type: String,
        required:true,
    },
    user:{
        type: String,
        required : true
    },
    date:{
        type: Date,
        default:Date.now
    }
});

//we are creating the model here.
//we will call this schema ideas and it will be connected to IdeaSchema
mongoose.model('ideas',IdeaSchema);