// clubServer.js
const express = require('express');
const app = express();
app.use(express.static('public'));

const nunjucks = require('nunjucks');

nunjucks.configure('templates', {
    autoescape: true,
    express: app
});
let host = 'localhost';
let port = 3020;


const activities = require('./eventData.json');

let urlencodedPar = express.urlencoded({
    extended: true
});
let memberApplications = [];
const bcrypt = require('bcryptjs');
let nRounds = 10;
const users = require('./clubUsersHash.json');

const session = require('express-session');
const cookieName = "clubsid";
app.use(session({
    secret: 'website development CSUEB',
    resave: false,
    saveUninitialized: false,
    name: cookieName
}));

const redirectLogin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    } else {
        next()
    }
}

const SessionMiddleware = function(req, res, next) {
    if (!req.session.user) {
        req.session.user = { loggedin: false };
    }
    next();
};
app.use(SessionMiddleware);

const checkLoggedIn = function(req, res, next) {
    if (!req.session.user.loggedin) {
        res.render('Lerror.njk');
    } else {
        next();
    }
};

const AdMiddleware = function(req, res, next) {
    if (req.session.user.role !== "admin") {
        res.render('aderror.njk', {
            user: req.session.user
        });
    } else {
        next();
    }
};


//get 
app.get('/', function(req, res) {
    res.render('index.njk', {
        user: req.session.u,
        activities: activities, user: req.session.user
    });
});


app.get('/member', function(req, res) {
    res.render('member.njk', {
        user: req.session.user
    });
})


app.get('/users', AdMiddleware, function(req, res) {
    res.render('users.njk', {
        members: users,
        user: req.session.user
    });
})

app.get('/suggestions', function(req, res) {
    res.render('suggestions.njk', {
        user: req.session.user
    });
})

app.get('/logout', function(req, res) {
    let options = req.session.cookie;
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        }
        res.clearCookie(cookieName, options);
        res.render('bye.njk');
    })
})


app.get('/activities', function(req, res) {
    res.render('activities.njk', { activities: activities, user: req.session.user });
})

app.get('/add', checkLoggedIn, function(req, res) {
    res.render('addactivities.njk', {
        user: req.session.user
    });
})

app.get('/addact', checkLoggedIn, function(req, res) {
    //let testVar = req.query;
    //console.log(req.query.activity_name);
    //activities.push(req.query.activity_name);
    let info = req.query;
    console.log("Add Activity");
    console.log(req.query);
    let newAct = new Object();
    newAct.name = info.activity_name;
    newAct.dates = info.activity_date;
    newAct.description = info.activity_description;
    activities.push(newAct);
    // activities.push({ 
    //   name: req.query.activity_name, 
    //    dates: req.query.activity_date, 
    //     description: req.query.activity_description });

    console.log(activities.length);
    if (activities.length > 100) {
        activities.shift();
    }
    res.redirect('./activities');
})



app.get('/users', AdMiddleware, function(req, res) {
    res.render('users.njk', {
        members: clubUsers,
        user: req.session.user
    });
})

function myFunction(element) {
    if (element.hasOwnProperty('password')) {
        let salt = bcrypt.genSaltSync(nRounds);
        let passhash = bcrypt.hashSync(element.password, salt);
        element.hash = passhash;
        delete element.password;
    }
}

app.get('/login', function(req, res) {
    res.render('login.njk', {
        user: req.session.user
    });
})

//post
app.post('/login', urlencodedPar, function(req, res) {
    let info = req.body;
    let email = info.email;
    let password = info.password;

    let auser = users.find(function(element) {
        return element.email === email;
    });

    if (!auser) {
        res.status(400).render('errorPass.njk');
        return;
    }
    let verified = bcrypt.compareSync(password, auser.passhash);
    if (verified) {
        let oldSession = req.session.user;
        req.session.regenerate(function(err) {
            if (err) {
                console.log(err);
            }
            req.session.user = Object.assign(oldSession, auser, {
                loggedin: true
            });
            res.render('goodPass.njk', {
                user: req.session.user
            });
        });
    } else {
        res.status(400).render('Lerror.njk');
    }
});



app.post('/apply', urlencodedPar, function(req, res) {
    console.log(req.body);
    myFunction(req.body);
    memberApplications.push(req.body);
    console.log("- New member Added");
    //memberApplications.forEach(myFunction);
    console.log(memberApplications);

    let info = req.body;
    res.render('thx.njk', {
        info: info
    });
});


app.get('/info', express.json(), function(req, res) {
    let info = {
        "clubName": "VR MOVIE CLUB of Tracy",
        "ownerName": "Harjot Singh",
        "ownerNetId": "pb3778"
    };
    //res.render('info.njk', { info: clubName, info: ownerName, info: ownerNetId });
    res.json(info);

});

app.listen(port, host, function() {
    console.log(`deployTest.js app listening on IPv4: ${host}:${port}`);
});