const mongoose = require('mongoose');
const signupSchema = new mongoose.Schema({ 
	first_name: { 
		type: String, 
		required: true, 
	}, 
	last_name: { 
		type: String, 
		required: true, 
	}, 
	email:{
        type: String, 
		required: true, 
    },
    password:{
        type: String, 
		required: true, 
    },
    confirm_password:{
        type: String, 
		required: true, 
    }
}); 


const signup = mongoose.model("signup", signupSchema); 

module.exports = signup;
