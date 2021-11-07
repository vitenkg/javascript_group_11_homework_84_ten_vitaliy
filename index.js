const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exitHook = require('async-exit-hook');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const port = 8000;

const run = async () => {
    await mongoose.connect('mongodb://localhost/HW84');

    app.listen(port, () => {
        console.log(`Server started on ${port} port`);
    });

    exitHook(() => {
        console.log('Mongo Exiting...');
        mongoose.disconnect();
    });
};

run().catch(e => console.error(e));