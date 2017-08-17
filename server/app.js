const express = require('express');
const morgan = require('morgan');
var bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.listen(8484);

// add your code here
var todos = [
    {
      todoItemId: 0,
      name: 'an item',
      priority: 3,
      completed: false
    },
    {
      todoItemId: 1,
      name: 'another item',
      priority: 2,
      completed: false
    },
    {
      todoItemId: 2,
      name: 'a done item',
      priority: 1,
      completed: true
    }
];

var status = 'ok';

//Returns a generic object (String letting us know status is 'ok')
app.get('/', (req, res) => {
    res.status(200).json("status: '"+status+"'");
});

//Returns all current todos in JSON format)
app.get('/api/TodoItems', (req, res) => {
    res.status(200).json(todos);
});

//Returns the todo with the specified ID
app.get('/api/TodoItems/:number', (req, res, next) => {
    var id = req.params.number;
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].todoItemId == id) {
            res.status(200).json(todos[i]);
            next();
        }
    }
    res.send("No Todo was found with that information");
});

//Adds or updates a todo with the specified ID and other info
app.post('/api/TodoItems', function(req, res) {
    var id = req.param('todoItemId');
    var matched = false;
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].todoItemId == id) {
            matched = true;
            todos[i].name = req.param('name');
            todos[i].priority = req.param('priority');
            todos[i].completed = req.param('completed');
            res.status(201).json(todos[i]);
        }
    }
    if (!matched) {
        var newTodo = {
            todoItemId: req.param('todoItemId'),
            name: req.param('name'),
            priority: req.param('priority'),
            completed: req.param('completed')
        }
        res.status(201).json(newTodo);
        todos.push(newTodo);
    }
});

//Deletes a todo with the specified ID. If none exists, nothing happens
app.delete('/api/TodoItems/:number', function(req,res) {
    var id = req.params.number;
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].todoItemId == id) {
            res.status(200).json(todos[i]);
            todos.splice(i,1);
            matched = true;
        }
    }
});

module.exports = app;
