var express = require("express");
const router = express.Router();
const async = require('async');
const request = require('request');
const cors = require('cors');
const bodyParser = require('body-parser');

const http = require("http").createServer(express);
const io = require("socket.io")(http);

const connectDB = require('./config/db');
const MapPlacement = require('./models/MapPlacement');

// Connect DB
connectDB();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
/*
app.use('/api/placement', require('./routes/api/placement'));
app.use('/api/user', require('./routes/api/user'));
*/
/*
let placementString = "";
for(let i = 1;i <=50;i++) {
  for(let j = 1;j <= 50;j++)
    placementString += "00";
}

let tmp = [];

for(let i = 1;i <= 50;i++)
  tmp[i - 1] = i;

async.each(tmp, async (ttt) =>{
  let j;
  for(j = 1;j <= 50;j++) {
    let map = new MapPlacement({
      address: ttt + "-" + j,
      placementstring: placementString
    });
    // Save user to DB
    await map.save();
  }
  console.log("Done");
});*/

/*let placementString = "";
for(let i = 1;i <=50;i++) {
  for(let j = 1;j <= 50;j++)
    placementString += "00";
}

let tmp = [];

for(let i = 1;i <= 50;i++)
  tmp[i - 1] = i;*/

var players = {};

io.on("connection", async (socket) => {
/*  async.each(tmp, (ttt) =>{
    let j;
    for(j = 1;j <= 50;j++) {
      let map = new MapPlacement({
        address: ttt + "-" + j,
        placementstring: placementString
      });

      // Save user to DB
      map.save();
    }
    console.log("Done");
  });*/

  console.log("a user connected: ", socket.id);
  socket.on("join", async (address, targetPos, x, y) => {
    // create a new player and add it to our players object
    console.log(address);
    players[socket.id] = {
      playerId: socket.id,
      address: address,
      targetPos: targetPos,
      x: x,
      y: y,
      chatContent: ""
    };
    //set x, y

    let map = await MapPlacement.findOne({ address });
    socket.emit("currentPlayers", players);
    socket.emit("mapInit", map.placementstring);
    socket.broadcast.emit("newPlayer", players[socket.id]);
  });

  socket.on("playerMovement", function (movementData) {
    var tilem = movementData.tilem;
    var tilen = movementData.tilen;
    // emit a message to all players about the player that moved
    socket.broadcast.emit("playerMoved", players[socket.id], tilem, tilen);
  });

  socket.on("playerPosition", function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
  });

  socket.on("mapMovement", async (Info) => {
    var Address = Info.address;
    var MapInfo = Info.mapInfo;

    try {
      MapPlacement.updateOne({address: Address},
        { placementstring: MapInfo}, async (err, docs) => {
        if(err)
          console.log(err);
        else {
          console.log("MapPlacement");
        }
      });
    } catch(error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
//    socket.broadcast.emit("playerMoved", players[socket.id], tilem, tilen);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    socket.disconnect();
  });
});
/*
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
*/
http.listen(3306, async () => {
  try {
      console.log("Listening on port :%s...", http.address().port);
  } catch (e) {
      console.error(e);
  }
});