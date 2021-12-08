const mongoose = require("mongoose");

//Define the schema for a model
const TodoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,

    },
    done:{
        type:Boolean,
        required:true
    }
});
//Set the model, collection name against the schema 
const TodoModel = mongoose.model("Todo",TodoSchema);
module.exports = TodoModel;

