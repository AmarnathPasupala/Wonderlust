let express=require("express");
let router=express.Router({mergeParams:true});
// let ExpressError=require("../utils/ExpressError.js");
let wrapAsync=require("../utils/wrapAsync.js");
// let {reviewSchema}=require("../schema.js");
let Listing=require("../models/listing.js");
const Review = require("../models/review.js");
let {validateReview,redirectUrl,isLoggedIn,isReviewAuthor}=require("../middleware.js");
let reviewController=require("../controllers/reviews.js");





router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addReview));

router.delete("/:rid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));



module.exports=router;