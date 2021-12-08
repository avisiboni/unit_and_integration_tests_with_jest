const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../models/todo.model');
const mockHttp = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");
const {Promise} = require("mongoose");
//Override mongoose function in order to spy on it
//This is can be replaced by - jest.mock("../../mock/todo.model")
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();


let req, res, next;
let todoId = "61b0e696b60b6ea831aeef8d";
const fakeTodoId = "61b0eb5d5fc15421e9e2e8a1";

//Define a function that will run before each test
beforeEach(() => {
    req = mockHttp.createRequest();
    res = mockHttp.createResponse();
    next = jest.fn();

})
//Define a test suit 
describe("TodoController.createTodo", () => {

//Define a function to run before each case on this specific test suits
    beforeEach(() => {
        req.body = newTodo;
    })

    //Define a test case
    it("Should have a createTodo function ", () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });
    it("Should call TodoModel.create ", () => {
        TodoController.createTodo(req, res, null);
        expect(TodoModel.create).toBeCalledWith(newTodo);
    });
    it("Should return 201 status code", async () => {
        await TodoController.createTodo(req, res, null);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled).toBeTruthy();
    });
    it("Should return create to do as json in response", async () => {
        TodoModel.create.mockReturnValue(newTodo);
        await TodoController.createTodo(req, res, null);
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it("Should handle error on creation", async () => {
        const error = {message: "property is missing"};
        const rejection = Promise.reject(error);
        TodoModel.create.mockReturnValue(rejection);
        await TodoController.createTodo(req, res, next);
        expect(next).toBeCalledWith(error);
    })
});

describe("TodoController.getTodos", () => {
    it("Should have a getTodos function", () => {
        expect(typeof TodoController.getTodos).toBe("function")
    });
    it("Should call find method with {} ", async () => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenLastCalledWith({});
    });
    it("Should return response 200 with todos", async () => {
        TodoModel.find.mockReturnValue(allTodos);
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(allTodos);
    });
    it("Should throw error in getTodos", async () => {
        const error = {message: "Something went wrong while finding!"};
        const rejection = Promise.reject(error);
        TodoModel.find.mockReturnValue(rejection);
        await TodoController.getTodos(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });
})

describe("TodoController.getTodoById", () => {
    let req, res, next;
    beforeEach(() => {
        req = mockHttp.createRequest();
        res = mockHttp.createResponse();
        next = jest.fn();

    })
    it("Should have  a getTodoById", () => {
        expect(typeof TodoController.getTodoById).toBe("function");
    });
    it("Should findById have been called with route parameters", async () => {
        req.params.todoId = todoId;
        await TodoController.getTodoById(req, res, next);
        expect(TodoModel.findById).toBeCalledWith(todoId);
    });
    it("Should response code 200 with a single todo  ", async () => {
        TodoModel.findById.mockReturnValue(newTodo);
        req.params.todoId = "61b0e696b60b6ea831aeef8d";
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);

    });
    it("Should failed due error handling", async () => {
        const error = {message: "Error while finding todo"};
        const rejection = Promise.reject(error);
        TodoModel.findById.mockReturnValue(rejection);
        await TodoController.getTodoById(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });
    it("Should return 404 when no todo have found ", async () => {
        TodoModel.findById.mockReturnValue(null);
        await TodoController.getTodoById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();

    });
});
describe("TodoController.updateTodo", () => {
    it("Should have a update todo function ", () => {
        expect(typeof TodoController.updateTodo).toBe("function");
    });
    it("Should  TodoModel.findByIdAndUpdate should be call ", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        await TodoController.updateTodo(req, res, next)
        expect(TodoModel.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, {new: true, useFindAndModify: false})
    });
    it("Should return updated todo with status 200 ", async () => {
        req.params.todoId = todoId;
        req.body = newTodo;
        TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it("Should throw error handling ", async () => {
        const error = {message: "Something occur during update"};
        const rejection = Promise.reject(error);

        TodoModel.findByIdAndUpdate.mockReturnValue(rejection);
        await TodoController.updateTodo(req, res, next);

        expect(next).toHaveBeenCalledWith(error);

    });
    it("Should throw 404 todo not found", async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled).toBeTruthy();
    })
})
describe('TodoController.deleteTodo', () => {
    beforeEach(() => {
        req = mockHttp.createRequest();
        res = mockHttp.createResponse();
        next = jest.fn();

    })
    it("Should have a function deleteTodo ", () => {
        expect(typeof TodoController.deleteTodo).toBe("function");
    });
    it('TodoModel.delete Should called ', async () => {
        await TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalled();

    });
    it('TodoModel.delete Should called with todoId ', async () => {
        req.params.todoId = todoId;
        await TodoController.deleteTodo(req, res, next);
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith({_id: todoId});

    });
    it('Should return 204 on deleted  ', async () => {
        req.params.todoId = todoId;
        TodoModel.findByIdAndDelete.mockReturnValue(newTodo);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    });
    it('Should return 404 on deleted  ', async () => {
        req.params.todoId = fakeTodoId;
        TodoModel.findByIdAndDelete.mockReturnValue(null);
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('Should throw of unhandled error on deleted  ', async () => {
        const error = {message: "This operation are forbidden "};
        const rejection = Promise.reject(error);
        TodoModel.findByIdAndDelete.mockReturnValue(rejection);

        req.params.todoId = fakeTodoId;
        await TodoController.deleteTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });
});
