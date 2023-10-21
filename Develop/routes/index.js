const express = require('express');

const notesRouter = require('./notes');      // Import router for notes.js

const app = express();

app.use('/notes', notesRouter);             // For request that start with a /notes look at the notesRouter

module.exports = app;