const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");
const endpoint = "/todos/";
let firstTodo, newTodoId;
const fakeTodoId = "61b0eb5d5fc15421e9e2e8a1";
const updatedTodoMock = { title:"Our first completed test", done:true};
describe(endpoint, () => {
    it("POST " + endpoint, async () => {
        const response = await request(app)
            .post(endpoint)
            .send(newTodo);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.done).toBe(newTodo.done);
        newTodoId = response.body._id;
    })
    it("GET Should return error 500 on invalid data model " + endpoint, async ()=> {
        const response = await request(app)
            .post(endpoint)
            .send({title:"Only title have been sent"});
        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({message:"Todo validation failed: done: Path `done` is required."});
    });
    it("GET "+ endpoint, async()=>{
        const response = await  request(app).get(endpoint);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(  response.body)).toBeTruthy();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].done).toBeDefined();
        firstTodo = response.body[0];
    });
    it("GET /:id" + endpoint , async()=>{
        const url = endpoint + firstTodo._id;
        const response = await  request(app)
            .get(url);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstTodo.title);
        expect(response.body.done).toBe(firstTodo.done);

    });
    it("GET /:id with fake id should return 404 ",async()=>{
        const response = await request(app).get(endpoint + fakeTodoId);
        expect(response.statusCode).toBe(404);
    });
    it("PUT "+ endpoint, async()=>{

        const responses = await  request(app).put(endpoint + newTodoId).send(updatedTodoMock);
        expect(responses.statusCode).toBe(200);
        expect(responses.body.title).toBe(updatedTodoMock.title);
        expect(responses.body.done).toBe(updatedTodoMock.done);
    });
    it("Should throw status code 404", async()=> {
        const response = await  request(app).put(endpoint + fakeTodoId).send(newTodo);
        expect(response.statusCode).toBe(404);
    });
    it("DELETE " + endpoint, async()=> {
        const response =await request(app).delete(endpoint + newTodoId ).send();
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedTodoMock.title);
        expect(response.body.done).toBe(updatedTodoMock.done);
    });
    it("DELETE Should return 404 with fake todo id" + endpoint, async()=> {
        const response =await request(app).delete(endpoint + fakeTodoId ).send();
        expect(response.statusCode).toBe(404);
    })
})
