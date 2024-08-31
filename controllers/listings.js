let Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    let listings =await Listing.find({});
    res.render("listings/index.ejs",{listings});    
}

module.exports.renderNewListingForm=(req,res)=>{    
    res.render("listings/new.ejs");
}

module.exports.saveListing=async (req,res,next)=>{        
    let listing = new Listing(req.body.listing);
    let url=req.file.path;
    let filename=req.file.filename;
    listing.owner=req.user._id;
    // console.log(url,filename);
    listing.image={url,filename};
    await listing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.updateListing=async (req,res)=>{
    let {id}= req.params;    
    let listing=await Listing.findByIdAndUpdate(id,req.body.listing);
   
    // console.log(filename,"...",url);
    // console.log(listing);
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.viewListing=async (req,res)=>{
    let {id}=req.params;
    // console.log(req.originalUrl,"...",req.path);
    let listings =await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listings);
    res.render("listings/view.ejs",{listings});    
}

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    let listings=await Listing.findById(id);
    if(!listings){
        req.flash("error","Listing that you want to edit is not present!");
        res.redirect("/listings");
    }
    let originalImageUrl=listings.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    // console.log(originalImageUrl);
    res.render("listings/edit.ejs",{listings,originalImageUrl});
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let listings = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");    
}