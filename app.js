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

app.use(require("express-session")({
    secret: "my name is akash",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

var google_client_id = '116854944974-jjbv4adn25np5k6v0upv05keung5saft.apps.googleusercontent.com';
var google_client_secret = 'UjGct1OQK8niW0fwwNZY0tZa';

// passport.use(new passportGoogle({
//     clientID: google_client_id,
//     clientSecret: google_client_secret,
//     callbackURL: "/auth/google/callback"
// }, function (accessToken, refreshToken, profile, done) {
//     console.log(profile);
//     user.register({username: profile.displayName}, function(err, user){
//     return done(err, user);
    
// })
// })
// )



app.use(function(req, res, next){
    res.locals.currentuser = req.user;
    next();
});
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

// app.get('/auth/google',
//     passport.authenticate('google', {
//         scope: ['profile', 'email']
//     }));
// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login', successRedirect: '/' }),
//     function (req, res) {
//         res.redirect('/');
//     });

app.get("/", function (req, res) {
    res.render("home.ejs");
})

app.get("/login", function (req, res) {
    res.render("login.ejs");
})
app.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, userr, info) {
        if (err) {
            return next(err);
        }
        if (!userr) {

            return res.redirect("/login");
        }
        req.login(userr, function (err) {
            if (err) {
                console.log(err);
            } else {

                res.redirect("/user/" + userr._id);

            }
        })
    })(req, res, next);
})


app.get("/signup", function (req, res) {
    res.render("signup.ejs");
})
app.post("/signup", function(req, res){
    user.register(new user({username: req.body.username, password: req.body.password}), req.body.password, function(err, createduser){
        if (err) {
            console.log(err);
            res.redirect("/signup");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/user/" + createduser._id);
            })

        }
    })
})

app.get("/forgotpassword", function (req, res) {
    res.render("f_pwd.ejs");
})
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
})

app.get("/user/:userid" , isloggedin, function(req, res){
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
app.get("/user/:userid/new",isloggedin, function (req, res) {
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
app.post("/:userid/new",isloggedin, function(req, res){
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

app.get("/user/:userid/ques/:qid",isloggedin, function(req,res){
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

app.put("/user/:userid/ques/:qid",isloggedin, function(req, res){
    card.findByIdAndUpdate(req.params.qid, req.body.ques, function(err, updatedcard){
        if (err) {
            console.log(err);
        }else{
            res.redirect("/user/"+req.params.userid);
        }
    })
})

app.get("/main", function(req,res){
    card.find({},function(err, allcards){
        if (err) {
            console.log(err);
        }else{
            res.render("main.ejs", {card: allcards});
        }
    })
})

app.delete("/delete/:userid/:cardid",isloggedin, function(req,res){
    if(req.body.delete == "DELETE"){
        card.findByIdAndRemove(req.params.cardid, function (err, nul) {
            if (err) {
                console.log(err);
            } else {
                user.findById(req.params.userid, function (err, founduser) {
                    if (err) {
                        console.log(err);
                    } else {
                        founduser.card.remove(req.params.cardid);
                        founduser.save(function (err, nul) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.redirect("/user/" + req.params.userid);
                            }
                        })
                    }
                })
            }
        })
    } else {
        res.redirect("/user/" + req.params.userid);
    }
    
})

function isloggedin(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect("/login");
    }
}

app.listen(process.env.PORT || 3300, function(){
    console.log("server has started");
});





