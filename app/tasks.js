const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/Task");
const {param} = require("express/lib/router");

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const users = await Task.find({name: req.user.name});

        res.send(users);
    } catch (e) {
        res.sendStatus(500);
    }

});

router.post('/', auth, async (req, res) => {
    if (!req.body.title || !req.body.status) {
        return res.status(400).send({error: 'Data No Valid'});
    }

    const taskData = {
        name: req.user._id,
        title: req.body.title,
        description: req.body.description || null,
        status: req.body.status,
    }

    const task = new Task(taskData);

    try {
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.put('/:id', auth, async (req, res) => {
    let taskEdit = await Task.findOne({_id: req.params.id})

    taskEdit = {
        name: taskEdit.name,
        title: req.body.title || taskEdit.title,
        description: req.body.description || taskEdit.description,
        status: req.body.status || taskEdit.status,
    };

    try {
        await Task.findByIdAndUpdate(req.params.id, taskEdit);
        res.send(taskEdit);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (task) {
            res.send(`Task ${task.title} is removed`);
        } else {
            res.status(404).send({error: 'Product no found'});
        }
    } catch (e) {
        res.status(500).send(e);
    }
})

module.exports = router;