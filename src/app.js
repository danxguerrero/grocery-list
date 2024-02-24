const express = require('express');
const app = express();
const { User, List, Item } = require('../models/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// User routes
app.get("/users", async(req, res, next) => {
    try{
        const allUsers = await User.findAll();
        res.send(allUsers);
    } catch(error) {
        next(error)
    }
});

app.get("/users/:id", async(req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        res.send(user);
    } catch(error) {
        next(error)
    }
});

app.post("/users", async (req, res, next) => {
    try {
        const createdUser = await User.create(req.body);
        res.json(createdUser);
    } catch (error) {
        next(error)
    }
});

app.delete("/users/:id", async (req, res, next) => {
    try {    
        const deleted = await User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.sendStatus(200);
    } catch (error) {
        next(error)
    }
});

// List routes
// Create a list
app.post("/users/:id/list", async (req, res, next) => {
    try {    
        const createdList = await List.create(req.body);
        const user = await User.findByPk(req.params.id);
        await createdList.setUser(user);
        await createdList.addCollaborators(user);
        res.json(createdList);
    } catch(error) {
        next(error)
    }
});

// Get all lists from created by a user
app.get("/users/:id/lists", async (req, res, next) => {
    try {
        const allLists = await List.findAll({
            include: [
                {
                    model: User,
                    as: 'collaborators', 
                    attributes: ['id', 'username'],
                }
            ],
            where: {
                userId: req.params.id,
            }
        });
        res.json(allLists)
    } catch(error) {
        next(error)
    }
});

app.get("/lists", async (req, res, next) => {
    try {    
        const allLists = await List.findAll({
            include: [
                {
                    model: User,
                    as: 'collaborators', 
                    attributes: ['id', 'username'],
                }
            ]
        });
        res.json(allLists)
    } catch(error) {
        next(error)
    }
})

// Get a list by id
app.get("/list/:id", async (req, res, next) => {
    try {
        const list = await List.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'collaborators', 
                    attributes: ['id', 'username'],
                },
                {
                    model: Item,
                    attributes: ['name', 'createdBy'],
                }
            ]
        })
        res.json(list)
    } catch(error){
        next(error)
    }
});

// Update a list 
app.put("/users/:userId/list/:listId", async (req, res, next) => {
    try {    
        const list = await List.findOne({
            where: {
                id: req.params.listId,
                userId: req.params.userId
            }
        });
        const updatedList = await list.update(req.body);
        res.json(updatedList);
    } catch(error) {
        next(error)
    }
});

// Add collaborator to list
app.post("/list/:listId/collaborator/:userId", async (req, res, next) => {
    try {    
        const list = await List.findByPk(req.params.listId)
        const user = await User.findByPk(req.params.userId)
        list.addCollaborators(user)
        res.sendStatus(201)
    } catch(error) {
        next(error)
    }
});

// Remove collaborator from list
app.put("/list/:listId/collaborator/:userId", async (req, res) => {
    try {
      const list = await List.findByPk(req.params.listId);
      const user = await User.findByPk(req.params.userId);
  
      if (!list || !user) {
        return res.status(404).send("List or user not found");
      }
  
      list.removeCollaborators(user);
  
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });

// Delete a list
app.delete("/users/:userId/list/:listId", async (req, res, next) => {
    try {    
        await List.destroy({
            where: {
                id: req.params.listId,
                userId: req.params.userId
            }
        });
        res.sendStatus(200);
    } catch(error) {
        next(error)
    }
});

// Item routes
// Create an item
app.post("/list/:listId/item", async (req, res, next) => {
    try {
        const list = await List.findByPk(req.params.listId)

        if (!list) {
            return res.sendStatus(404)
        }

        const item = await Item.create(req.body)
        item.setList(list)

        res.send(item)
    } catch (error) {
        next(error)
    }
})

// Get item
app.get('/list/:listId/item/:itemId', async (req, res, next) => {
    try {
        const item = await Item.findByPk(req.params.itemId)

        res.send(item)
    } catch (error) {
        next(error)
    }
})

// Update an item
app.put('/list/:listId/item/:itemId', async (req, res, next) => {
    try{
        const item = await Item.findOne({
            where: {
                id: req.params.itemId,
                ListId: req.params.listId
            }
        });

        const updatedItem = await item.update(req.body)
        res.send(updatedItem)
    } catch (error) {
        next(error)
    };
});

// Delete an item
app.delete('/list/:listId/item/:itemId', async (req, res, next) => {
    try {    
        await Item.destroy({
            where: {
                id: req.params.itemId,
                ListId: req.params.listId
            }
        });

        res.sendStatus(200);
    } catch (error) {
        next(error)
    };
});



module.exports = app;