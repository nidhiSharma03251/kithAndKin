const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const path = require("path");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const mongoose = require("mongoose");

main().then(() =>{console.log("connected");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

app.get("/", (req,res)=>{
  res.send("HII, it's working!")
})

//shows all the list (home route)
app.get("/listings", async(req,res)=>{
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", {allListings});
})

//creating a form to create new list
app.get("/listings/new", (req,res)=>{
  res.render("./listings/new.ejs");
})

//create new list
app.post("/listings", async(req,res)=>{
  let listing = req.body.listing;
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})


//shows a particular list by searching with findbyid. 
app.get("/listings/:id", async(req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/show.ejs", { listing });
})

//renders an update form
app.get("/listings/:id/edit", async(req,res)=>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("./listings/edit.ejs", { listing });
})

//update route
app.put("/listings/:id", async(req,res) =>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`);
})

//deleting a list
app.delete("/listings/:id", async(req,res) =>{
  let { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
  console.log(deletedList);  
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