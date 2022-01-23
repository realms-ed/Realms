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

var cert = `MIIEWjCCA0KgAwIBAgIJAISe53Mbr3zHMA0GCSqGSIb3DQEBBQUAMHsxCzAJBgNV
BAYTAlVTMRcwFQYDVQQIEw5Ob3J0aCBDYXJvbGluYTEPMA0GA1UEBxMGRHVyaGFt
MRgwFgYDVQQKEw9EdWtlIFVuaXZlcnNpdHkxDDAKBgNVBAsTA09JVDEaMBgGA1UE
AxMRc2hpYi5vaXQuZHVrZS5lZHUwHhcNMDgwNzEwMTIwNTM0WhcNMjgwNzA1MTIw
NTM0WjB7MQswCQYDVQQGEwJVUzEXMBUGA1UECBMOTm9ydGggQ2Fyb2xpbmExDzAN
BgNVBAcTBkR1cmhhbTEYMBYGA1UEChMPRHVrZSBVbml2ZXJzaXR5MQwwCgYDVQQL
EwNPSVQxGjAYBgNVBAMTEXNoaWIub2l0LmR1a2UuZWR1MIIBIjANBgkqhkiG9w0B
AQEFAAOCAQ8AMIIBCgKCAQEAv0ZYz9Zf3C6/22GDrB1cvQzpKcOgoeVX6NAowu99
0YaK1nlTN6AeJLsoVEum1cUUligaxCX9/5XPolx84vYbfGreBRDVXGbNCJFpDa9s
rPtBcu2htAvrXLL7+na8CnhsncNAlZvK8zHrhiDlSjC0/dcVqBGDWg7ZYmtMiFXi
tZbITtJ3g+gjdJEs5CFE/MAP8O9xoBDPF5y64atMaG7UYbKo1Czbx7p1taOeayTt
okTfoRTZbCRoRRzG49CejLLF6fmXtEFbN8zpb2OWSEDMeOC92eUT3/4J87i3sIDe
Hh1IoJN5ETKFfZp0GbtrAxj+tVTFf4bQPInY1Lv281pMUwIDAQABo4HgMIHdMB0G
A1UdDgQWBBSCqzfMcKlbkm3Wrwf3mePSWS02YDCBrQYDVR0jBIGlMIGigBSCqzfM
cKlbkm3Wrwf3mePSWS02YKF/pH0wezELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5v
cnRoIENhcm9saW5hMQ8wDQYDVQQHEwZEdXJoYW0xGDAWBgNVBAoTD0R1a2UgVW5p
dmVyc2l0eTEMMAoGA1UECxMDT0lUMRowGAYDVQQDExFzaGliLm9pdC5kdWtlLmVk
dYIJAISe53Mbr3zHMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEFBQADggEBAIPZ
tIcbb4jIkc5ucU+lPRCtMecWVWcRQTcRMuYoWao/FrRt4rPQ9+RpdDSNPduDNfxo
E4/PkidshcCdJLEQAdy904puyT9u0FmuELW0qCNCI89B67pCDs8bwCiHsD6s8D5c
CZ++SXhEoTjdvuR8zmcOb+ZKYd5kdDU26HTvprfoBA2KdC9QEhBd5tMGYP3CNVn5
Oq1NcLtkNWMSq1QuKSIH+0A+sk7JQQV5suDgkwhw+GiQaACvLVZ7ycV2ILkJ2Tk9
MtJY3fAFXPW7IfSXTJu5reCPeUZFFhgz/IRGleWhCs1Bdp1rWibtvubIjwLcsFcO
rIKb1CBs2k0TJEFNSlo=`

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
