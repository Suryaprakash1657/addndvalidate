const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Username:{
        type:String,
        required : true,
        unqiue : true
    },
    mail:{
        type:String,
        required : true,
        unqiue : true
    },
    password:{
        type:String,
        required : true,
    }
})
UserSchema.methods.comparePass=async function(comparePassword) {
    return await bcrypt.compare(comparePassword,this.password) 
}


module.exports = mongoose.model('Schema',UserSchema);