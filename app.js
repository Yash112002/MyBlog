const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-yash:9818664936@cluster0.0u2ciwe.mongodb.net/MyBlog", {
    useNewUrlParser: true
})

const blogsSchema = {
    title: String,
    content: String,
    date: String
}

const Blog = mongoose.model("Blog", blogsSchema);

const homeStartingContent = "Basically I am a computer science engineering student of delhi technological university. I completed my schooling from Rajkiya Pratibha Vikas Vidyalay. I love to watch movies and webseries. Cricket fascinates me a lot. I am teaching students as a home tutor from last two years. So, I am a teacher also. Best thing about me is I always remain motivated. I always tries to find the solutions to my problems which I face in everyday life. I am not very social. For example I love to be alone. I can call myself as extrovertIntrovert. You can read my blogs down below...";

// const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


app.get("/", (req, res) => {

    Blog.find({}, (err, found) => {
        if (err) console.log(err);
        else {
            res.render('home', {
                homeStartingContent: homeStartingContent,
                posts: found,
                date: found.date
            });
        }
    })
})

app.get("/about", (req, res) => {
    res.render('about')
})

app.get("/stories", (req, res) => {
    res.render('stories');
})

app.get("/soon", (req, res) => {
    res.render('soon');
})

app.get("/:title", (req, res) => {
    const demand = req.params.title;
    res.render('check', {
        demand: demand
    });
})
app.post("/check", (req, res) => {
    const demand = req.body.demand;
    console.log(demand);
    const name = req.body.name;
    const password = req.body.password;
    if (name == "Yash" && password == "Yash@1234") {
        if (demand == "compose") res.render('compose');
        else res.render('delete');
    } else {
        res.redirect('/');
    }
})

app.post("/compose", (req, res) => {
    var objToday = new Date(),
        weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = function () {
            var a = objToday;
            if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
            a = parseInt((a + "").charAt(1));
            return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th"
        }(),
        dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
    var today = dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
    console.log(today);
    const blog = new Blog({
        title: _.capitalize(req.body.title),
        content: req.body.content,
        date: today
    })
    blog.save();
    res.redirect("/");
})

app.get("/blogs/:blogName", (req, res) => {
    const requestedBlog = _.capitalize(req.params.blogName);
    Blog.findOne({
        title: requestedBlog
    }, (err, found) => {
        if (err) console.log(err);
        else {
            res.render('post', {
                title: found.title,
                content: found.content,
                date: found.date,
            })
        }
    })
})

app.get("/delete", (req, res) => {
    Blog.find({}, (err, found) => {
        if (err) console.log(err);
        else {
            if (found) {
                res.render('delete', {
                    blogs: found
                });
            }
        }
    })
})

app.post("/delete", (req, res) => {
    const dTitle = _.capitalize(req.body.title);
    console.log(dTitle);
    Blog.findOneAndDelete({
        title: dTitle
    }, (err, found) => {
        if (err) console.log(err);
        else {
            if (found) {
                console.log("deleted succesfully");
                res.redirect("/");
            } else {
                console.log("Blog Does'nt Exists");
                res.redirect("/");
            }
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 4000;
}
app.listen(port, function (req, res) {
    console.log("Server started on port 4000");
});