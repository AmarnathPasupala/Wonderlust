let express=require("express");
let router=express.Router();

router.get("/",(req,res)=>{
    res.send(`you are at users`);
});

router.get("/:id",(req,res)=>{
    res.send("you are at user:id");
})

router.get("/:id/hello",(req,res)=>{
    res.send(`you are at user:id hello`);
});


module.exports=router;