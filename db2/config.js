const  mongoose = require('mongoose');
// var conn=mongoose.connect("mongodb+srv://prashantnegi123321:12345@cluster0.m88ay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",

var conn=mongoose.connect("mongodb://127.0.0.1:27017/demodata",
{
useNewUrlParser:true,
useUnifiedTopology:true
})

.then(()=>console.log('MongoDB connection Succesfull'))
.catch((err)=>console.log(err));

module.exports = conn;










