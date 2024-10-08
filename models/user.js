let mongoose=require("mongoose");
let Schema=mongoose.Schema;
let passportLocalMongoose=require("passport-local-mongoose");

let userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);