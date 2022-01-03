require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient

let db;
//const uri = "mongodb+srv://Ray:OOAiz65vvPzJXWz1@realms.x18ki.mongodb.net/REALMS?retryWrites=true&w=majority";
const uri = process.env.MONGODB_URI;

MongoClient.connect(uri, (err, client) => {
  if(err) {
    return console.log(err);
  }
  db = client.db('Rooms');
});

console.log("db looks like this: ");
console.log(db);
console.log("URI looks like this: ");
console.log(uri);

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
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.render('index', {});
});

const path = require('path');
const homePath = path.join(__dirname, 'views');

app.get('/host/:roomid', (req, res, next) => {
  id = req.params.roomid;
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  db.createCollection(id, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
  });
  return res.sendFile(path.join(homePath, 'analysis.html'))
});

app.get('/join/:roomid/:name', (req, res) => {
  id = req.params.roomid;
  screen_name = req.params.name;

  const result = db.collection(id).insertOne({
    name: screen_name,
    status: "content"
  });
  return res.sendFile(path.join(homePath, 'student.html'))
});

app.post('/update/:roomid/:name/:status', (req, res) => {
  id = req.params.roomid;
  screen_name = req.params.name;
  current_status = req.params.status;

  const d = new Date();
  time = d.getTime();
  console.log(time);

  const filter = { name : screen_name };
  const options =  { upsert : true };

  const updateDoc = {
    $set: {
      name: screen_name,
      status: current_status,
      latest: time
    },
  };
  const result = db.collection(id).updateOne(filter, updateDoc, options);
});

var mongoose = require('mongoose')

process.on('SIGINT', function() {
  db.command( { killAllSessions: [{}]  } )
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

app.listen(port, () => console.log(`Zoom Web Meeting SDK Sample Signature Node.js on port ${port}!`))
