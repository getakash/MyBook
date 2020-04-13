var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    passportLocal           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
    user                    = require("./models/user"),
    card                    = require("./models/card"),
    methodOverride          = require("method-override");

mongoose.connect("mongodb+srv://akash_verma:zigzagzoo@cluster0-8ogkm.mongodb.net/test?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use(methodOverride("_method"));

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(require("express-session")({
//     secret: "my name is akash",
//     resave: false,
//     saveUninitialized: false
// }));
// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());


// user.create({
// 	username: "dolgy pantro",
// 	password: "zigzagzoo",
// }, function(err, user){
// 	if(err){
// 	console.log(err);
// 	}else{
// 		console.log("new user signed in");
// 		console.log(user);
// 	}
// });

// card.create({
//     label: "web development",
//     date: Date.now()
// }, function (err, card1) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("new card is made");
//         console.log(card1);
//     }
// });

app.get("/", function (req, res) {
    res.render("home.ejs");
})

app.get("/login", function (req, res) {
    res.render("login.ejs");
})

app.get("/signup", function (req, res) {
    res.render("signup.ejs");
})
app.post("/signup", function(req, res){
    user.create({username: req.body.username, password: req.body.password}, function(err, createduser){
        if (err) {
            console.log(err);
            res.redirect("/signup");
        }else{
            res.redirect("/user/"+ createduser._id +"/new");
        }
    })
})

app.get("/forgotpassword", function (req, res) {
    res.render("f_pwd.ejs");
})

app.get("/user/:userid" , function(req, res){
    user.findById(req.params.userid, function(err, founduser){
        if (err) {
            console.log(err);
        }else{
            card.find({_id: {"$in": founduser.card}}, function(err, foundcard){
                if (err) {
                    console.log(err);
                }else{
                    res.render("userpage.ejs", {user: founduser, card: foundcard});
                }
            })
        }
    })
})
app.get("/user/:userid/new", function (req, res) {
    user.findById(req.params.userid, function (err, founduser) {
        if (err) {
            console.log(err);
        } else {
            card.find({ _id: { "$in": founduser.card } }, function (err, foundcard) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("new.ejs", { user: founduser, card: foundcard });
                }
            })
        }
    })
})
app.post("/:userid/new", function(req, res){
    user.findById(req.params.userid, function(err, founduser){
        if(err){
            console.log(err);
            res.redirect("/user/"+ req.params.userid +"/new");
        }else{
            var date = new Date();
            var dated = date.toDateString();
            console.log(dated);
            var carddata = {
                label: req.body.label,
                title: req.body.title,
                link: req.body.link,
                description: req.body.description,
                date: dated,
                uploader: founduser.username
            };
            card.create(carddata, function (err, createdcard) {
                if(err){
                    console.log(err);
                    res.redirect("/user/" + req.params.userid + "/new");
                }else{
                    founduser.card.push(createdcard);
                    founduser.save(function(err, user){
                        if (err) {
                            console.log(err);
                        }else{
                            res.redirect("/user/"+req.params.userid);
                        }
                    })
                }
            })
        }

    })
})

app.get("/user/:userid/ques/:qid", function(req,res){
    user.findById(req.params.userid, function (err, founduser) {
        if (err) {
            console.log(err);
        } else {
            card.find({ _id: { "$in": founduser.card } }, function (err, foundcard) {
                if (err) {
                    console.log(err);
                } else {
                    card.findById(req.params.qid, function(err, card_edit){
                        if (err) {
                            console.log(err);
                        }else{
                            res.render("edit.ejs", { user: founduser, card: foundcard, card_edit: card_edit });
                        }
                    })
                }
            })
        }
    })
})

app.put("/user/:userid/ques/:qid", function(req, res){
    card.findByIdAndUpdate(req.params.qid, req.body.ques, function(err, updatedcard){
        if (err) {
            console.log(err);
        }else{
            res.redirect("/user/"+req.params.userid);
        }
    })
})






app.listen(process.env.PORT || 3300, function(){
    console.log("server has started");
});





