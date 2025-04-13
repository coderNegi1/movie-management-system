const mongoose = require("mongoose");

const contactschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    massage: {
        type: String
    }

});


const contactusschema = new mongoose.model('contactdata',contactschema)


module.exports= contactusschema;