const routes = require('./routes/routes')
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const cors = require('cors'); 
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use('/', routes);
app.listen(3002);