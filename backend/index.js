const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chalk = require('chalk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGOURL;

app.use(express.json());
app.use(cors());


const DB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log(chalk.blue('DB connected Successfully'));
    } catch (error) {
        console.log(chalk.red(' Try Again, DB is Not connected', error));
    }
};
DB();


const User = require('./Schema');  

app.get('/Info', (req, res) => {
    res.send('This is Adding and Validation Assignment 1');
});

app.post('/User', async (req, res) => {
    const { Username, mail, password } = req.body;

    try {
        if (!Username || !mail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ mail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }


        const newUser = new User({ Username, mail, password });
        await newUser.save();

        return res.status(201).json({
            message: "User Successfully Registered",
            User: { Username, mail } 
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

// Checking And Matching Users Login Password
app.post('/login/auth', async(req,res) => {

    const {mail,password} = req.body;

    try {
        if(!mail || !password){
            return res.status(400).json({
                message : "All fields are required"
            })

        }
        

        //Check if User exists

        const FindUser = await User.findOne({mail});

        if(!FindUser){
            return res.status(400).json({message : "User not exists",
            })
        }
        
        const match = await FindUser.ComparePass(password);


        if(FindUser && !match){
            return res.status(400).json({
                message : "Invalid Password or Password didnt matched"
            })
        }
        else{
            return res.status(201).json({
                message : "Password Matched",
                User : FindUser
            })
        }
        
    } catch (error) {

        return res.status(400).json({message : "Something went wrong",
            error : error.message
        })
    }
})

app.listen(port, () => {
    console.log(chalk.blue(`Server is running at http://localhost:${port}`));
});