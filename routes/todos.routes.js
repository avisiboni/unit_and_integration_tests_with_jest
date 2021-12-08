const express = require("express");
const routes = express.Router();
const TodoController = require("../controllers/todo.controller");

routes.post("/",TodoController.createTodo)
routes.get("/",TodoController.getTodos)
routes.get("/:todoId",TodoController.getTodoById)
routes.put("/:todoId",TodoController.updateTodo)
routes.delete("/:todoId",TodoController.deleteTodo)


module.exports = routes;
