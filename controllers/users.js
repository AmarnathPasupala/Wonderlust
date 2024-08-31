let User=require("../models/user.js")

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp=async (req,res)=>{
    // res.send("hello");
    try{
        let {username,email,password}=req.body;
        // console.log(username,email,password);
        let newUser=new User({email,username});
        let registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wonderlust");
            res.redirect("/listings");
        })        
    }
    catch(error){
        req.flash("error",error.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm=(req,res)=>{
    // res.send("working!");
    res.render("users/login.ejs")
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to wonderlust");
    // console.log(res.locals.redirectUrl,"...",req.originalUrl);

    let redirect=res.locals.redirectUrl|| "/listings";
    res.redirect(redirect);
    // res.send("good");

}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout successfully");
        res.redirect("/listings");
    })
}