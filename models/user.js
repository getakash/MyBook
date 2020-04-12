var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    card                    = require("../models/card"),
    passportLocalMongoose   = require("passport-local-mongoose");

var userschema = new mongoose.Schema({
    username: String,
    password: String,
    card: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "card"
    }],
});

userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userschema);