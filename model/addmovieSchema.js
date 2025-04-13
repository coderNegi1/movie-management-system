const mongoose = require('mongoose');
const addmovie = new mongoose.Schema({
    moviename: {
        type: String,
        // required:true
    },
    date: {
        type: String,
        // required:true
    },
    description:{
        type: String,
       // required:true

    },
   
    age:{ type:Number,
        // required:true
    },
    choose_genere:{
        type:String,
       // required:true
    },
    duration:{
        type:String,
       // required:true

    },
    quality:{
        type:String,
       // required:true

    },
    cover:{
        type:String
       
    },
    country:{
        type:String,
       // required:true

    },
    director: {
        type:String,
        // required:true
    },
    rating: {
        type:Number,
        // required:true
    },
    cast: {
        type:String,
        // required:true
    }
});

const addmovieschema = new mongoose.model('addmovies',addmovie);
module.exports= addmovieschema;