require("dotenv").config(); 
var express = require("express")
var app = express();
var router = require('./controler/router');
const conn = require('./db2/config');
const bodyParser = require("body-parser");





app.set('view engine','ejs');


app.use(express.static('views'));
app.use(express.static('upload'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',router);

app.listen(3007)




