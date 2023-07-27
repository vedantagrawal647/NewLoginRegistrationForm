//conection to database --monogodb

//step1  require mongoose
const mongoose = require("mongoose");

//step2 connection with database
mongoose.connect("mongodb://localhost:27017/youtubeRegistration",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log(`connection successfull`)
}).catch((e)=>{
    console.log(`no connection`)
});