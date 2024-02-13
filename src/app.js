const express = require('express');
const app = express();
const { User, List, Item } = require('../models/index');

app.use(express.json());
app.use(express.urlencoded());

// User routes
app.get("/users", async(req, res) => {
    const allUsers = await User.findAll();
    res.send(allUsers);
});

app.get("/users/:id", async(req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id);
    res.send(user);
});

app.post("/users", async (req, res) => {
    const createdUser = await User.create(req.body);
    res.json(createdUser);
});

app.delete("/users/:id", async (req, res) => {
    const deleted = await User.destroy({
        where: {
            id: req.params.id
        }
    });
    res.sendStatus(200);
});

// List routes
// Create a list
app.post("/users/:id/list", async (req, res) => {
    const createdList = await List.create(req.body);
    const user = await User.findByPk(req.params.id);
    await createdList.setUser(user);
    await createdList.addCollaborators(user);
    res.json(createdList);
});

// Get all lists from created by a user
app.get("/users/:id/lists", async (req, res) => {
    const allLists = await List.findAll({
        where: {
            userId: req.params.id
        }
    });
    res.json(allLists)
});

// Get a list by id
app.get("list/:id", async (req, res) => {
    const list = await List.findOne({
        where: {
            id: req.params.id
        }
    })
})

// Update a list 
app.put("users/:userId/list/:listId", async (req, res) => {
    const list = await List.findOne({
        where: {
            id: req.params.listId,
            userId: req.params.userId
        }
    });
    const updatedList = await list.update(req.body);
    res.json(updatedList);
});

// Delete a list
app.delete("users/:userId/list/:listId", async (req, res) => {
    await List.destroy({
        where: {
            id: req.params.listId,
            userId: req.params.userId
        }
    });
    res.sendStatus(200);
});

// Add collaborator to list


module.exports = app;