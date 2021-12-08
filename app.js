const express = require("express");
const app = express();
const todoRoutes = require("./routes/todos.routes");
const mongodb = require("./mongodb/mongodb.connection")

mongodb.connect().then(()=>{})
//Define a middleware that serializing the body as a json 
app.use(express.json())

app.use("/todos",todoRoutes);

app.use((error,req,res,next)=> {
    res.status(500).json({message:error.message})
})


module.exports = app; 
