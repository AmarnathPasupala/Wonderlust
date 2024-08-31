require('dotenv');
// console.log(process.env);

let express = require("express");
let app=express();
let port=8080;
const mongoose = require('mongoose');
let path=require("path");
let methodOverride=require("method-override");
let Listing=require("./models/listing.js");
let engine = require('ejs-mate');
let ExpressError=require("./utils/ExpressError.js");
let wrapAsync=require("./utils/wrapAsync.js");
let {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
let session=require("express-session");
let MongoStore=require("connect-mongo");
let flash=require("connect-flash");
let passport=require("passport");
let LocalStrategy=require("passport-local");
let User=require("./models/user.js");


let listingRouter=require("./routes/listings.js");
let reviewRouter=require("./routes/reviews.js");
let userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLASDB_URL;


main().then((res)=>{
    console.log("connection successful!");
}).catch((err) =>{
     console.log(err)});

async function main() {
  await mongoose.connect(dbUrl,{ useNewUrlParser: true });
}

let store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",error);
})

let sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine('ejs', engine);

let validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        // let errMsg=error.details.map((er)=>er.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

let validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        console.log(error);
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

app.listen(port,()=>{
    console.log(`app is listening at ${port}`);
});

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();    
});

// app.get("/registerUser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"hello@gmail.com",
//         username:"hello",
//     });
//     let newUser=await User.register(fakeUser,"amar1234");
//     console.log(newUser);
//     res.send(newUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);






app.all("*",(req,res,next)=>{
    next(new ExpressError(401,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {status=501,message="Some Error"}=err;
    // console.log(status,message);
    res.render("error.ejs",{err});
    // res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
})

