const express = require('express');
const mongoose=require('mongoose');
const bcrypt= require('bcrypt');
const Schema= require('./Schema.js')
const cors=require('cors');
require('dotenv').config();
const app = express();
const port = 3010;
app.use(express.json());
app.use(cors());
const MONGO_URL=process.env.MONGOURL

const DB = async() => {
    await mongoose.connect(MONGO_URL)
    .then(res => console.log('DB connected Successfully'))
    .catch(e => console.log('Try Again DB is Not connected'))
}
DB();

app.get('/Info',(req,res) => {
    res.send('this Is Adding and validation Assignment 1');
})

app.post('/User', async(req,res) => {
    const {Username,mail,password} = req.body;
    try {

        if(!Username || !mail || !password){
            return res.status(400).json(({
                message:"All fields are required"
            }))
        }
        const hashedpass= await bcrypt.hash(password, 10);

        const newUser = new Schema({Username,mail,password: hashedpass});
        await newUser.save();

        return res.status(200).json(({
            message : "User Successfully Added to the system",
            User : newUser
        }))

        
    } catch (error) {
        return res.status(400).json({
            message : "User not found or Invalid data",
            error : error.message
        });
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
