const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description: String,
    image:{
        filename:{ 
            type: String
    },
    url:{
        type: String,
        default:"https://unsplash.com/photos/green-palm-trees-near-body-of-water-during-daytime-d86EYC9H9tg",
        set: (v) => v=== ""? "https://unsplash.com/photos/green-palm-trees-near-body-of-water-during-daytime-d86EYC9H9tg" : v
    }
    },
    price:Number,
    location: String,
    country:String
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 