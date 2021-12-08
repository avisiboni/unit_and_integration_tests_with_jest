const TodoModel = require("../models/todo.model");
exports.createTodo = async (req, res, next) => {
    try {
        const createdTodo = await TodoModel.create(req.body);
        res.status(201).json(createdTodo);
    } catch (e) {
        next(e);
    }
};

exports.getTodos = async (req, res, next) => {
    try {
        const allTodos = await TodoModel.find({});
        res.status(200).json(allTodos);
    } catch (e) {
        next(e);
    }
}
exports.getTodoById = async (req, res, next) => {
    try {
        const todo = await TodoModel.findById(req.params.todoId);
        if (todo) {
            res.status(200).json(todo);
        } else {
            res.status(404).send()
        }
    } catch (e) {
        next(e);
    }
}
exports.updateTodo = async (req, res, next) => {
    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(
            req.params.todoId,
            req.body, {
                new: true,
                useFindAndModify: false
            })
        if(updatedTodo){
            res.status(200).json(updatedTodo);
        }else{
            res.status(404).send();
        }

    } catch (e) {
        next(e);
    }
}
exports.deleteTodo  = async(req,res,next)=>{
  try {
      const response = await TodoModel.findByIdAndDelete({_id:req.params.todoId});
      if(response){
          res.status(200).json(response);
      }else{
          res.status(404).send();
      }
  }catch (e) {
      next(e)
  }


}
