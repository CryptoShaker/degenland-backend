const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const MapPlacement = require('./models/MapPlacement');
const Building = require('./models/Building');

//Add cors middleware
app.use(cors());

const server = http.createServer(app);

// Connect DB
connectDB();

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

var players = {};

// Add this
// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
  console.log("a user connected: ", socket.id);
  socket.on("join", async (address, targetPos, x, y) => {
    // create a new player and add it to our players object
    players[socket.id] = {
      playerId: socket.id,
      address: address,
      targetPos: targetPos,
      x: x,
      y: y,
      chatContent: ""
    };
    //set x, y

//    let map = await MapPlacement.findOne({ address });

    let buildingList = await Building.find({ address: address });
    socket.emit("currentPlayers", players);
    socket.emit("mapInit", players[socket.id], buildingList);
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

/*  socket.on("mapMovement", async (Info) => {
    var Address = Info.address;
    var MapInfo = Info.mapInfo;

    try {
      MapPlacement.updateOne({address: Address},
        { placementstring: MapInfo}, async (err, docs) => {
        if(err)
          console.log(err);
        else {
          console.log('success');
          socket.broadcast.emit("changeMap", players[socket.id], MapInfo);
        }
      });
    } catch(error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });*/

  socket.on("setRoad", async (building) => {
    let newBuilding = new Building({
			address: building.address,
			pos: building.pos,
			type: building.type,
			built: building.built,
			remaintime: building.remaintime,
			ads: building.ads,
      owner: building.owner
    });
    // Save user to DB
    await newBuilding.save();
    socket.broadcast.emit("changeMap", newBuilding);
  });

  socket.on("setBuilding", async (building) => {
    let newBuilding = new Building({
			address: building.address,
			pos: building.pos,
			type: building.type,
			built: building.built,
			remaintime: building.remaintime,
			ads: building.ads,
      owner: building.owner
    });
    // Save user to DB
    await newBuilding.save();
    socket.broadcast.emit("changeMap", newBuilding);

    let count = building.remaintime + 1;
    let interval = setInterval(async () => {
      count--;

      let build = await Building.findOne({ address: building.address, pos: building.pos });
      if(build) {
        build = await Building.findOneAndUpdate(
          { address: building.address, pos: building.pos },
          { remaintime: count - 1 },
          { new: true }
        );
        socket.emit("buildingTime", build);
      }

      /**
       * building completion
       */
      if(count == 1) {
        let build = await Building.findOne({ address: building.address, pos: building.pos });
        if(build) {
          build = await Building.findOneAndUpdate(
            { address: building.address, pos: building.pos },
            { built: true },
            { new: true }
          );
        }
        io.emit("buildingCompletion", players[socket.id], build);
        clearInterval(interval);
      }
    }, 1000);
  });

  /**
   * In Construction
   */
  socket.on("inConstruction", async (building) => {
    let count = building.remaintime + 1;
    let interval = setInterval(async () => {
      count--;

      let build = await Building.findOne({ address: building.address, pos: building.pos });
      if(build) {
        build = await Building.findOneAndUpdate(
          { address: building.address, pos: building.pos },
          { remaintime: count - 1 },
          { new: true }
        );
        socket.emit("in-buildingTime", build);
      }

      /**
       * building completion
       */
      if(count == 0) {

        clearInterval(interval);
        io.emit("in-buildingCompletion", building);
        let build = await Building.findOne({ address: building.address, pos: building.pos });
        if(build) {
          build = await Building.findOneAndUpdate(
            { address: building.address, pos: building.pos },
            { built: true },
            { new: true }
          );
        }
      }
    }, 1000);
  });

  socket.on("disconnect", function () {
    console.log("user disconnected: ", socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    socket.disconnect();
  });
});

server.listen(3306, () => 'Server is running on port 3306');