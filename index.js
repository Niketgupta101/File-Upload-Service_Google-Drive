const express = require('express');
const routes = require('./routes/index');

const app = express();
require('dotenv').config();

const cors = require('cors');
app.use(cors());

app.use(express.json());

app.use(routes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})