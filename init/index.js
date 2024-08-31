// let mongoose=require("mongoose");
let initData=require("./data.js");
let Listing=require("../models/listing.js");


let mongoose=require("mongoose");

main().then((res)=>{
    console.log("connection successful!");
}).catch((err) =>{
     console.log(err)});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// console.log(initData);
let initDB=async ()=>{
    await Listing.deleteMany({});
    initData.sampleListings=initData.sampleListings.map((obj)=>({...obj,owner:'66c6de219b917a1a0dc296eb'}));
    await Listing.insertMany(initData.sampleListings);
}

initDB();