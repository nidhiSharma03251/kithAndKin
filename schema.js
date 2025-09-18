const Joi = require("joi");

//according to our schema validation our listing should be an object and it must be "required"; (Whenever a request is sent their should be listing object always)
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description : Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required()
});
