let Listing=require("./models/listing.js");
let Review=require("./models/review.js");
let ExpressError=require("./utils/ExpressError.js");
let {reviewSchema,listingSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to do this");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}= req.params;    
    let listing1=await Listing.findById(id);
    if(res.locals.currUser && !(res.locals.currUser._id.equals(listing1.owner._id))){
        req.flash("error","you are not the owner");
        return res.redirect(`/listings/${listing1._id}`);
    }    
    next();
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        // let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        // let errMsg=error.details.map((er)=>er.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,rid}= req.params;    
    let review=await Review.findById(rid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        console.log(review.author._id,"...",res.locals.currUser._id);
        req.flash("error","you are not the author of the review");
        return res.redirect(`/listings/${id}`);
    }    
    next();
}






