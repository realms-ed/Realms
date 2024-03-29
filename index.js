require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = crypto.randomBytes(32);
const cors = require('cors')
const { MongoClient } = require('mongodb');
var mongoose = require('mongoose');
var session = require('express-session')
var passport = require('passport');
var saml = require('passport-saml');
var favicon = require('serve-favicon');
var fs = require('fs');

var duke_cert = fs.readFileSync('certs/our-idp-server-https-cert.pem', 'utf-8').split(/\r?\n/);
var priv = fs.readFileSync('certs/my-server-private.key', 'utf-8');
var my_cert = fs.readFileSync('certs/my-server-https-cert.crt', 'utf-8');

const iv = crypto.randomBytes(16);

let db;
const uri = "mongodb+srv://Ray:OOAiz65vvPzJXWz1@realms.x18ki.mongodb.net/REALMS?retryWrites=true&w=majority";
//const uri = process.env.MONGODB_URI;

const mongoOptions = { useUnifiedTopology: true };

const client = new MongoClient(uri, mongoOptions);

MongoClient.connect(uri, (err, client) => {
  if (err) {
    return console.log(err);
  }
  db = client.db('Rooms');
});
try {
  // Connect to the MongoDB cluster
  client.connect();
} catch (e) {
  console.error(e);
}








const app = express()
const port = process.env.PORT || 4000

app.use(bodyParser.json(), cors())
app.options('*', cors());

app.use(session(
  {
    resave: true,
    saveUninitialized: true,
    secret: 'this shit hits'
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use(express.static('public'))

app.post('/', (req, res) => {

  const timestamp = new Date().getTime() - 30000
  const msg = Buffer.from(process.env.ZOOM_JWT_API_KEY + req.body.meetingNumber + timestamp + req.body.role).toString('base64')
  const hash = crypto.createHmac('sha256', process.env.ZOOM_JWT_API_SECRET).update(msg).digest('base64')
  const signature = Buffer.from(`${process.env.ZOOM_JWT_API_KEY}.${req.body.meetingNumber}.${timestamp}.${req.body.role}.${hash}`).toString('base64')

  res.json({
    signature: signature
  })
})

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    console.log("Authenticated!");
  }
  if (req.user) {
    console.log(req.user);
    res.render('index', {user: req.user});
  } else {
    res.render('login', {});
    //res.render('index', {user: {fullname: 'Ray Lennon'}});
  }
});

const path = require('path');
const homePath = path.join(__dirname, 'views');

function encrypt(text) {
  var cipher = crypto.createCipheriv(algorithm, password, iv)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipheriv(algorithm, password, iv)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}


var SamlStrategy = require('passport-saml').Strategy;

var strategy = new SamlStrategy(
  {
    path: '/login/callback',
    callbackUrl: 'https://realms-ed.herokuapp.com/login/callback',
    entryPoint: 'https://shib.oit.duke.edu/idp/profile/SAML2/Redirect/SSO',
    issuer: 'https://realms-ed.herokuapp.com',
    cert: duke_cert,
    decryptionPvk: priv,
    identifierFormat: null,
  },
  function (profile, done) {
    console.log('thing: ')
    console.log(profile);
    return done(null,
      {
        fullname: profile['urn:oid:2.16.840.1.113730.3.1.241']

      });  })

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get(
  '/SSOLogin',
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get('/Shibboleth.sso/Metadata',
  function (req, res) {
    res.type('application/xml');
    res.send(200, strategy.generateServiceProviderMetadata(my_cert, undefined));
  }
);

app.post(
  "/login/callback",
  bodyParser.urlencoded({ extended: false }),
  function (req, res, next) {
    passport.authenticate("saml", { successRedirect: '/', failureRedirect: "/", failureFlash: true })(req, res, next);
    console.log('okay then...');
  }
);

app.get('/create/:roomid', (req, res, next) => {
  id = req.params.roomid;
  if (id.length < 10) {
    id = id.padStart(10, "0");
  }
  db.listCollections({ name: id })
    .next(function (err, collinfo) {
      if (collinfo) {
        res.redirect('/');
      }
      else {
        db.createCollection(id, function (err, res) {
          if (err) throw err;
        });
        const hashedid = encrypt(id);
        return res.redirect('/host/' + hashedid);
      }
    });
});



app.get('/host/:hashedid', (req, res, next) => {
  var hashedid = req.params.roomid;
  return res.sendFile(path.join(homePath, 'teacher.html'))
});

app.get('/join/:roomid/:name', (req, res) => {
  id = req.params.roomid;
  if (id.length < 10) {
    id = id.padStart(10, "0");
  }
  screen_name = req.params.name;
  db.listCollections({ name: id })
    .next(function (err, collinfo) {
      if (collinfo) {
        const hashedinfo = encrypt(id + '|' + screen_name);
        res.redirect('/session/' + hashedinfo);
      }
      else {
        res.redirect('/');
      }
    });
});

app.get('/session/:hashedinfo', (req, res) => {
  const hashedinfo = req.params.hashedinfo;
  const info = decrypt(hashedinfo);
  const roomid = info.split('|')[0];
  const screen_id = info.split('|')[1];
  return res.sendFile(path.join(homePath, 'student.html'))
  return
});


app.post('/update/:hash/:status/:n', (req, res) => {
  const info = decrypt(req.params.hash).split('|');
  current_status = req.params.status;
  whethernew = req.params.n;
  roomid = info[0];
  screen_name = info[1];

  const d = new Date();
  time = d.getTime();
  const filter = { name: screen_name };
  const options = { upsert: true };
  if (whethernew == 'n') {
    const result = db.collection(roomid).updateOne(filter, {
      $set: {
        name: screen_name,
        status: current_status,
        latest: time
      },
      $push: {
        timestamps: [time, current_status]
      }
    }, options);
  } else {
    const result = db.collection(roomid).updateOne(filter, {
      $set: {
        name: screen_name,
        status: current_status,
        latest: time
      },
    }, options);
  }
  res.end()
  return
});

app.post('/getdata/:hash', async function (req, res) {
  const id = decrypt(req.params.hash);

  var students = [];

  var thing = await db.collection(id).find({}).toArray();
  var u = 0; var q = 0; var d = 0;
  let time = (new Date).getTime();

  for (var i = 0; i < thing.length; i++) {
    if (time - thing[i].latest < 4000) {
      if (thing[i].status == 'understand') { u++; }
      else if (thing[i].status == 'question') { q++; }
      else if (thing[i].status == 'dont_understand') { d++; }
    }
  }

  res.end(JSON.stringify({ understand: u, question: q, dont_understand: d }));
});





















process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

app.listen(port, () => console.log(`Zoom Web Meeting SDK Sample Signature Node.js on port ${port}!`))
