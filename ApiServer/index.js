const express = require('express');
const mongoose = require('mongoose');

const router = require('./router');
const CONFIG = require('./constants');

const app = express();

app.use(express.json());

mongoose
  .connect(CONFIG.MONGODB.connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log('mongoose error', err));

app.use(router);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('Server is running at:', port);
});
