const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js")

const path = require("path");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const mongoose = require("mongoose");

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

// const updateimg = async() =>{
//   await Listing.findOneAndUpdate(
//   { title: "Mountain View Cabin in Banff" },
//   { $set: { "image.url": "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" } }
// )
// }

// updateimg();

app.get("/", (req, res) => {
  res.send("HII, it's working!");
});

const validateListing = (req,res,next) =>{
   let { error } = listingSchema.validate(req.body);
  
  if(error){
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

//shows all the list (home route)
app.get("/listings", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
}));

//creating a form to create new list
app.get("/listings/new", (req, res) => {
  res.render("./listings/new.ejs");
});


//create new list
app.post("/listings", validateListing , wrapAsync(async (req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//shows a particular list by searching with findbyid.
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

    if(!listing){
      throw new ExpressError(501, "Fill in valid details")
    }

  res.render("./listings/show.ejs", { listing });
}));

//renders an update form
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);  
  res.render("./listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", validateListing , wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!req.body.listing.image.url) {
  req.body.listing.image.url = "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60";
  }

  listing.set(req.body.listing);
  await listing.save();
  res.redirect(`/listings/${id}`);
}));


//deleting a list
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedList = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
  console.log(deletedList);
}));

app.get("/testerror", (req, res, next) => {
  next(new ExpressError(400, "Testing error"));
});

app.all(/.*/ , (req,res,next) =>{
  next(new ExpressError(404, "Page not found!"));
});



app.use((err,req,res,next) =>{
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", {message});
  // res.status(status).send(message);
  //console.log(err); 
})

app.listen(1111, () => {
  console.log("Server is listening at port 1111");
});
