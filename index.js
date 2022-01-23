require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = crypto.randomBytes(32);
const cors = require('cors')
const { MongoClient } = require('mongodb');
var mongoose = require('mongoose');

var passport = require('passport');
var saml = require('passport-saml');

var pvk = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKosIaKqSZCAtB/I
0X947qYd+THvFto1S0+7Mu/AEIXVB9wOuZI0djbVwbZaMHIlnpFAJ2Me7hzI7HRY
xGSDMDhQx9x+NXroE0WoKBuaRpYlD0ZZ0rm+FTTvH67fJSpGl7OGvMQ0+eKNx0zJ
eWhZNe9abOKFFBmAAj+AfpDQA26HAgMBAAECgYBpw5v0GZo3MYbB6nIqo+LPY/mp
S0wMuurf1x1FXT3nsAt+fbhgYjLGyfvndg5+I1t2M0VHmcWsJkSv2yvUvKSOmDD6
InJBjmeQPbIDgHhvfhjakOPk7sjK2w75iC/Db4oHj21IE9RaRRVM2yVKx4NqjtMT
V3Um3V4rQHX6/H634QJBANeT6Ptyd7jyt8t4raP0XJj881qZ1DBP3SUFfqJyC64i
bokzTeW11k8Ulm8w5DqY4o7bRD8MlE10ppAJx78o3asCQQDKFLAJ78/RrMsR5HEw
i7HmuVmMKpsSjJd+uKRJ0IkeKw/iu4TVYnqmh1vfCKYHPqLxJIwumIm7YiBm4fi9
oT6VAkEAy0aAaSGNvMq5/lXjvfb8nZHfUm49A/U6vN8KgtjxJJj5C8xhxpoI4/aw
x1Ydzxc8gqJFHwKYkNTO/oEKZbl+EwJBAIunLl0/oMRLgO81i0+8Ss6jaxIl45M3
G/8URV1Jw2jY45qScuMwsohhZQlGpc6958d0tXgCLLUVxES1h7wtMd0CQAI/1F6M
r1YZOS2FO8sxvTBsjYiVfI2cMToVn3nZrOf2a/UfjR/C0LqKhKDzmqbLjDMaRg1G
jMTh5mRU46nQRt0=
-----END PRIVATE KEY-----`

var cert = `MIIF1DCCBLygAwIBAgIQDZ5vJeCPQ3ZROu/v7BtC7zANBgkqhkiG9w0BAQsFADBG
MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRUwEwYDVQQLEwxTZXJ2ZXIg
Q0EgMUIxDzANBgNVBAMTBkFtYXpvbjAeFw0yMTA2MDEwMDAwMDBaFw0yMjA2MzAy
MzU5NTlaMBoxGDAWBgNVBAMMDyouaGVyb2t1YXBwLmNvbTCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBALNy6VL9MDUWfxgLCRe5ZJwbEaroWasBNlaZurpV
vuZjBl1WZvfTjlhuRM3a+TE2+8j0yY7Nbi9dFKCxG7V4t4BqAYKd0LDqwE1v2W6i
72+8aRifsb7eh8udYkd4nusi1Phe69v0X5yRRY8UY0GhT+GQa3bQf39iyTf72LvI
dzW5bmSzx2GGIf5X4tmo0G0c83qmsLHv/WQiiT7+rqsVd3ntrT4rO3A34sjbcYDl
Zx7sVtVR9VG+kRq9k9WZiT/KQedrd5EkoFPgLzw82Ohykvgpn2vCLBz2f2ztWIB8
8lg1PcuKkBJ4F07uotxFCXgVnWLduTDjWvNYziYxjORoiiUCAwEAAaOCAugwggLk
MB8GA1UdIwQYMBaAFFmkZgZSoHuVkjyjlAcnlnRb+T3QMB0GA1UdDgQWBBQ45Vtp
NoLdKHKQKgpWN1cLNuoTfDAaBgNVHREEEzARgg8qLmhlcm9rdWFwcC5jb20wDgYD
VR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjA7BgNV
HR8ENDAyMDCgLqAshipodHRwOi8vY3JsLnNjYTFiLmFtYXpvbnRydXN0LmNvbS9z
Y2ExYi5jcmwwEwYDVR0gBAwwCjAIBgZngQwBAgEwdQYIKwYBBQUHAQEEaTBnMC0G
CCsGAQUFBzABhiFodHRwOi8vb2NzcC5zY2ExYi5hbWF6b250cnVzdC5jb20wNgYI
KwYBBQUHMAKGKmh0dHA6Ly9jcnQuc2NhMWIuYW1hem9udHJ1c3QuY29tL3NjYTFi
LmNydDAMBgNVHRMBAf8EAjAAMIIBfgYKKwYBBAHWeQIEAgSCAW4EggFqAWgAdwAp
eb7wnjk5IfBWc59jpXflvld9nGAK+PlNXSZcJV3HhAAAAXnIpXWPAAAEAwBIMEYC
IQCjQse4vq/dGyzNkVRstnLtnL9RxTsuWggbmQAGJKvFDQIhAO9QwGltSeOfKVfz
wTym6a75/5iVDeD8OEXGDNVDFdkhAHYAIkVFB1lVJFaWP6Ev8fdthuAjJmOtwEt/
XcaDXG7iDwIAAAF5yKV1cAAABAMARzBFAiEAySD/iqB2dtB4Eu/UkeJbFV27oJzG
UDWZq1bgO1xxNfICIEA2fEyCx59Pw55/7lrUK940oI6sIhYXg8guM6cTR7UdAHUA
UaOw9f0BeZxWbbg3eI8MpHrMGyfL956IQpoN/tSLBeUAAAF5yKV1sQAABAMARjBE
AiBdqlEUQE4qYpX5AIcDLjnsaJQ5ojXosipLvTSYz7wOKwIgJb79hIEM3iLqqnFi
FLMuFqOU1Bfa1HpkVyZ/d2AqjGQwDQYJKoZIhvcNAQELBQADggEBABagkSdzBJDm
ebm5a3sPkZ6wGyJtMdDTmDV/kon5l9m+p3yge0GPygGxvZh3kXSOn82w5edQEF/J
ikg86cPkwjLv++djIuVXhVK0EXC3qA/44CqBOGqfWTYQN/Wf0Sdn/4oiRBl6YUo4
2Li6DIBbrtlkFbHbOMQmbmE4ftFnvUikwWE2KkjUddVfEE+FZXsMXl5z741KoqJ0
LSDwVoG6bh6P12Dn3Lhpp7XOVlHx/0cnO+1RchpwgbthM36vWLyM2tQyo3t78/7g
mTHtDMNYWMPhxra6rrz3A7wtCPdJelKRbuGz6mSMUTad492F4YuAo6/DR7vX2QMb
vHTsSvmjOhU=`

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

var favicon = require('serve-favicon');
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
app.set('view engine', 'html');

app.get('/', function (req, res) {
  res.render('index', {});
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
    cert: cert,
    identifierFormat: null,
    decryptionPvk: pvk
  },
  function (profile, done) {
    console.log(profile);
  })

passport.use(strategy);

app.get('/SSOLogin',  passport.authenticate('saml', {
  successRedirect: '/',
  failureRedirect: '/error',
}));

app.post(
  "/login/callback",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  function (req, res) {
    res.redirect("/");
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
