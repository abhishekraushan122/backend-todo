const express = require('express') ;
const mongoose = require('mongoose') ;
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SignupModel = require("./signup/registermodel");
const TodoModel = require("./todolist");

var app = express(); 
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json()); 
const SECRET_KEY = 'NOTESAPI';

mongoose.connect("mongodb+srv://abhishekraushan43:Abhishek@cluster0.snu1yj6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get("/getTodoList", (req, res) => { 
    TodoModel.find({}) 
        .then((todoList) => res.json(todoList)) 
        .catch((err) => res.json(err)) 
});
app.post("/addTodoList", (req, res) => { 
    TodoModel.create({ 
        task: req.body.task, 
        status: req.body.status, 
        // deadline: req.body.deadline,  
    }) 
        .then((todo) => res.json(todo)) 
        .catch((err) => res.json(err)); 
}); 
app.post("/updateTodoList/:id",(req,res) => {
    const id = req.params.id;
    const updateData ={
        task:req.body.task,
        status: req.body.status, 
    };
    TodoModel.findByIdAndUpdate(id, updateData) 
        .then((todo) => res.json(todo)) 
        .catch((err) => res.json(err));
});

app.delete("/deleteTodoList/:id", (req, res) => { 
    const id = req.params.id; 
    TodoModel.findByIdAndDelete({ _id: id }) 
        .then((todo) => res.json(todo)) 
        .catch((err) => res.json(err)); 
}); 

// register and login
app.post('/signup', async (req, res) => {

 
    try {
      // Check if username or email already exists
      const existingUser = await SignupModel.findOne({ $or: [{ email: req.body.email }] });
      if (existingUser) {
        return res.status(400).json({ error: 'email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Create a new user
      const newUser = await SignupModel.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email:req.body.email,
        password: hashedPassword,
        confirm_password:hashedPassword
      });
  
      // Save the user to the database
      // await newUser.save();
  
      const token = jwt.sign({ email: newUser.email, id: newUser._id }, SECRET_KEY,{ expiresIn: "1h" });

      res.status(201).json({ status:200,message: 'User created successfully',data:newUser,token: token });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post("/login",
    async (req, res, next) => {
        let { email, password } = req.body;
 
        let existingUser;
        try {
            existingUser =
                await SignupModel.findOne({ email: email });
                if (!existingUser) {
                  return res.status(404).json({ message: 'User not found' });
                }

                const matchPassword = await bcrypt.compare(password,existingUser.password);
                if(!matchPassword){
                  return res.status(400).json({ message: 'Invalid Credentials' });
                }

                const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET_KEY,{ expiresIn: "1h" });
                res.status(201).json({ status:200,message: 'Login successfully',user: existingUser,token: token });
        } catch {
            const error =
                new Error(
                    "Error! Something went wrong."
                );
            return next(error);
        }
       l
        
    });
app.listen(3001, () => { 
    console.log('Server running on 3001'); 
}); 