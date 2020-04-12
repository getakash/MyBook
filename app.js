var express     = require("express"),
    app         = express();

app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("home.ejs");
})







app.listen(process.env.port, function(){
    console.log("server has started");
});





