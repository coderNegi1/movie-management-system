const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the registration schema
const registrationSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
        // Username of the user
    },
    contact: { 
        type: Number, 
        required: true 
        // Contact number of the user
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
        // Email of the user (must be unique)
    },
    address: { 
        type: String, 
        required: true 
        // Address of the user
    },
    password: { 
        type: String, 
        required: true 
        // Password for user authentication
    },
    
    resetToken: { 
        type: String, 
        default: null 
        // Token for password reset (defaults to null)
    },
    resetTokenExpire: { 
        type: Date, 
        default: null 
        // Expiry date for the reset token (defaults to null)
    }
});

// Pre-save middleware to hash password before saving
registrationSchema.pre("save", async function (next) {
    // Only hash the password if it's modified
    if (!this.isModified("password")) return next();
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next(); // Proceed with saving
    } catch (error) {
        next(error); // Handle errors during hashing
    }
});

// Method to compare plain-text password with hashed password
registrationSchema.methods.comparePassword = async function (plaintext) {
    // Compare the plain-text password with the stored hashed password
    return await bcrypt.compare(plaintext, this.password);
};

// Create and export the model using the registration schema
const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
