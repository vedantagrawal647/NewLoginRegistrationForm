//step1  --   require mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//step2   --  now we need to create a Schema
const employeeSchema = new mongoose.Schema({
    firstname : {
        type:String,
        required:true
    },
    lastname: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    gender: {
        type:String,
        required:true
    },  
    phone: {
        type:Number,
        required:true,
        unique:true
    },
    age: {
        type:Number,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    confirmpassword: {
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
})

//step19 generating tokens
//we call method when we work with instance
//midleware -- kosh kam jo jana lka baad or kush kaam ho jana ka pahala ki beech ka part middleware kahalata ha

employeeSchema.methods.generateAuthToken = async function(){
    try{
        //step23
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save(); 
        return token;
    }
    catch(err){
        res.send("the error part"+err);
        console.log("the error part"+err);
    }
}


//step15 password bcrypt hash
//save method ko call krna sa pahala
//converting password nto hash
employeeSchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        //normal passowrd is converted into Hash
         this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword=await bcrypt.hash(this.password,10) ;
    }
    next();
})

//step3  --  now we need to create a collection
//First letter of collection should be capital and Collection name should be singular
const Register = new  mongoose.model('Register', employeeSchema);


//step4  -- export Collection
module.exports =Register;
