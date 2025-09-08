const express = require("express");
const app = express();
const Listing = require("./models/listing.js");

const path = require("path");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));

const mongoose = require("mongoose");

main().then(() =>{console.log("connected");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

app.get("/", (req,res)=>{
  res.send("HII, it's working!")
})

app.get("/listings", async(req,res)=>{
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", {allListings});
})

// app.get("/testListing", async(req,res)=>{
//   let sampleListing = new Listing({
//     title:"helloroko hotel",
//     description:"the hotel pool",
//     price: 6000,
//     location: "Bodrum, Muğla",
//     country:"Turkey"
//   })

//   await sampleListing.save();
//   console.log("data got saved");
//   res.send("saved!");
// })

app.listen(1111, ()=>{
    console.log("Server is listening at port 1111");    
})