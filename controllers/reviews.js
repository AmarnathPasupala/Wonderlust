let Listing=require("../models/listing.js");
let Review=require("../models/review.js");

module.exports.addReview=async (req,res)=>{
    console.log(req.params.id);
    let listing= await Listing.findById(req.params.id);
    let newReview=await new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    console.log(req.user);

    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review Created");

    res.redirect(`/listings/${req.params.id}`);
}

module.exports.deleteReview=async (req,res)=>{
    let {id,rid}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : rid}});
    await Review.findByIdAndDelete(rid);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}