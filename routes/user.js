let express=require("express");
let router=express.Router();
let User=require("../models/user.js");
let passport=require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
let {redirectUrl,isLoggedIn}=require("../middleware.js");
let userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signUp));


router.route("/login")
.get(userController.renderLoginForm)
.post(redirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true,}),userController.login);


router.get("/logout",userController.logout);

module.exports=router;