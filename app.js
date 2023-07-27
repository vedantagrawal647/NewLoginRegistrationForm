 //step1-   npm init
//step2-   npm i express mongoose validator hbs bcryptjs  jwtwebtoken dotenv

//step21 Dotenv
//dotenv require at top
require("dotenv").config();



//step3   require, express,hbs,bcryptjs,jwtwebtoken and  path and start express 
const express = require("express");
const bcrypt = require("bcryptjs");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

//step6 to host dynamic website require hbs
const hbs = require("hbs");

//step10   require connection with database
require("./src/db/conn")
//step11  require Collection 
const Register = require("./src/models/registers")

//step6   define static path
//const static_path = path.join(__dirname,"public");

//step7   running static page
//app.use(express.static(static_path))

//step13 Handle Json File
app.use(express.json());
//step14 form ka under agar jo user likg rha agar usa get krna
app.use(express.urlencoded({extended:false}));

//Step7 define dynamic path
const templatePath = path.join(__dirname,"templates");
const partialsPath = path.join(templatePath,"partials");
const viewssPath = path.join(templatePath,"views");
console.log(partialsPath);

//step8 to set view engine
app.set("view engine",'hbs');
app.set("views",viewssPath);
hbs.registerPartials(partialsPath);



//step9 define route
app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

//step12  insert document in database
app.post("/register",async (req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.confirmpassword;
        if(password===cpassword)
        {
            const registerEmployee =new Register({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:req.body.password,
                confirmpassword:req.body.confirmpassword,
            })

            // step18 During Registration middleware jwtToken
            const token = await registerEmployee.generateAuthToken();
            console.log("token-- " +token);

            //document inserted in database
            const registered = await registerEmployee.save();
            res.status(201).render("index");
        }
        else{
            res.send("passwod are not matching")
        }

    }
    catch(err){
        res.status(400).send(err);
    }
})

//step13  login check
app.post("/login",async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const useremail =  await Register.findOne({email:email});

        //step16 to check user enter password  is match with Hashpassword that save in database
        const isMatch =  await bcrypt.compare(password,useremail.password);
        console.log(isMatch);

        // step20 During Login middleware jwtToken
        const token = await useremail.generateAuthToken();
        console.log("token part -- " +token);


        if(isMatch)
        {
            res.status(201).render("index");
        }
        else{
            res.send("invalid login details");
        }
    }
    catch(err){
        res.status(400).send("Invalid login detail")
    }
})

//step14 Secure password

//Encryption is dual way communication encoding decoding means if password is encoded then decoding is also possible .This is draback of encryption
//ex encoding  thapa --> encrypt -->  aab -->  decrypt  -->  thappa

//Hashing is a one way communication means cannot decrypt 
//ex hashing thapa --> ffggg.hhhfcc.djdjdj 

//bcrypt.js -- npm install bcryptjs
/*
    const bcrypt = require("bcryptjs")
    const securePassword = async (password)=>{
        //syntax bcrypt.hash(password that user write,round)
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);
        const passwordmatch = await bcrypt.compare(password,passwordHash);
        console.log(passwordmatch);
    }
    securePassword("thappa");
*/

//step17 Authentication and cookies (JWT)json web token
/*
    const jwt = require("jsonwebtoken");
    const createToken = async ()=>{
        //syntax jwt.sign(object payload which is unique,String)
    const token = await jwt.sign({_id:"64c166becad83b0faaac392f"},"secretkey",{expiresIn:"2 seconds"});

    const userVerify = await jwt.verify(token,"secretkey");
    console.log(userVerify)
    }
    createToken();
*/

//step4
app.get("/",(req,res)=>{
    res.send("hello fro vedant side");
})

//step5
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})