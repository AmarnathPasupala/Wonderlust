let express=require("express");
let router = express.Router({mergeParams:true});
let ExpressError=require("../utils/ExpressError.js");
let wrapAsync=require("../utils/wrapAsync.js");
let {listingSchema}=require("../schema.js");
let Listing=require("../models/listing.js");
let {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
let listingController=require("../controllers/listings.js");
const multer  = require('multer');
let {storage}=require("../cloudConfig.js")
const upload = multer({storage});



router.route("/")
.get(listingController.index)
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.saveListing));



router.get("/new",isLoggedIn,listingController.renderNewListingForm);


router.route("/:id")
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.get(wrapAsync(listingController.viewListing));


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));


module.exports=router;