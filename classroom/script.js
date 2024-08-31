let express=require("express");
let app=express();
let port=8080;
let users=require("./routers/user.js");
let posts=require("./routers/post.js");
let cookieParser=require("cookie-parser");
let session=require("express-session");
let flash=require("connect-flash");
let path=require("path");





app.use(cookieParser("secretCode"));

let sessionOptions={
    secret:"mySecretCode",
    resave:false,
    saveUninitialized: true
   
}

app.use(session(sessionOptions));
app.use(flash());

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


// sample sesssion

// app.get("/session",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });

app.listen(port,()=>{
    console.log("listining at ",port);
});

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonynous"}=req.query;
    req.session.name=name;
    if(name=="anonynous"){
        req.flash("error","user doesnot exit");
    }else{
        req.flash("success","user registered succesfully!");
    }    
    
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.render("hello.ejs",{name:req.session.name});
})






app.use("/users",users);
app.use("/posts",posts);


// cookies

app.get("/",(req,res)=>{
    res.cookie("name","amar",{signed:true});
    res.cookie("surname","pasupala",{signed:true});
    console.log(req.signedCookies);
    res.send(`hai ${req.signedCookies.name} ${req.signedCookies.surname}`);
    // res.send("working!");
});



