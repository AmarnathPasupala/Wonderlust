let express=require("express");
let router=express.Router();


router.get("/",(req,res)=>{
    res.send(`you are at posts`);
});
router.get("/:id",(req,res)=>{
    res.send("you are at posts:id");
});
router.get("/:id/hello",(req,res)=>{
    res.send(`you are at posts:id hello`);
});

module.exports=router;
