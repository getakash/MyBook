var express = require("express"),
    app = express(),
    mongoose = require("mongoose");

var cardschema = new mongoose.Schema({
    label: String,
    title: String,
    link: String,
    date: String,
    uploader: String,
});

module.exports = mongoose.model("card", cardschema);