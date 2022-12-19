const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const api = require("./api");

//db
const db = require('./config/db');
const Place = require('./models/Place');
const Placement = require('./models/Placement');
const Building = require('./models/Building');
const Account = require('./models/Account');
const Notification = require('./models/Notification');

const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const path = require("path");

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use("/api", api);
app.use(express.static(path.resolve('uploads')));

app.use('/images', express.static('uploads'));

// DB connect
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Add this
// Listen for when the client connects via socket.io-client
io.on("connection", async (socket) => {
  console.log("a user connected: ", socket.id);

  // Invite friend
  socket.on("inviteToFriend", async (fromId, toId, toPlayerId) => {
    let fromIdInfo = await Account.findOne({ accountId: fromId });

    if (fromIdInfo) {
      let playerInfo = {
        accountId: fromId,
        playerId: fromIdInfo.playerId,
        playerLvl: fromIdInfo.level,
        lvlProcess: (fromIdInfo.currentLevelScore / fromIdInfo.targetLevelScore) * 100,
        friendFlag: false,
        aliveFlag: true,
        avatarUrl: fromIdInfo.avatarUrl,
        degenlandNftCount: fromIdInfo.degenlandCount,
        tycoonNftCount: fromIdInfo.tycoonCount,
        mogulNftCount: fromIdInfo.mogulCount,
        investorNftCount: fromIdInfo.investorCount
      };

      let InviteInfo = new Notification({
        accountId: toId,
        playerId: toPlayerId,
        alertType: 'invite friend',
        playerInfo: playerInfo,
      });
      await InviteInfo.save();

      //      socket.broadcast.emit('inviteSuccess', InviteInfo, InviteInfo._id);
      let toIdInfo = await Account.findOne({ accountId: toId });
      io.to(toIdInfo.socketId).emit('inviteSuccess', InviteInfo, InviteInfo._id);
    }
  });

  //Accept invitation
  socket.on("setAccept", async (id1, id2) => {
    const toAccountId = id1;
    const fromAccountId = id2;

    await Notification.updateMany(
      { alertType: 'invite friend', accountId: toAccountId, 'playerInfo.accountId': fromAccountId, state: 'unread' },
      { state: 'accepted' }
    );

    socket.emit("clearAcceptedNotification", toAccountId);

    let fromIdInfo = await Account.findOne({ accountId: fromAccountId });
    io.to(fromIdInfo.socketId).emit("alertAccepted", fromAccountId);
  });

  //Decline invitation
  socket.on("setDecline", async (id1, id2) => {
    const toAccountId = id1;
    const fromAccountId = id2;

    await Notification.updateMany(
      { alertType: 'invite friend', accountId: toAccountId, 'playerInfo.accountId': fromAccountId, state: 'unread' },
      { state: 'declined' }
    );

    socket.emit("clearDeclinedNotification", toAccountId);

    let fromIdInfo = await Account.findOne({ accountId: fromAccountId });
    io.to(fromIdInfo.socketId).emit("alertDeclined", fromAccountId);
  });

  //Send private message
  socket.on("sendPrivateMsg", async(fromId, toId, toPlayerId, val) => {
    let fromIdInfo = await Account.findOne({ accountId: fromId });

    if (fromIdInfo) {
      let playerInfo = {
        accountId: fromId,
        playerId: fromIdInfo.playerId,
        playerLvl: fromIdInfo.level,
        lvlProcess: (fromIdInfo.currentLevelScore / fromIdInfo.targetLevelScore) * 100,
        friendFlag: false,
        aliveFlag: true,
        avatarUrl: fromIdInfo.avatarUrl,
        degenlandNftCount: fromIdInfo.degenlandCount,
        tycoonNftCount: fromIdInfo.tycoonCount,
        mogulNftCount: fromIdInfo.mogulCount,
        investorNftCount: fromIdInfo.investorCount
      };
      let privateMsgInfo = new Notification({
        accountId: toId,
        playerId: toPlayerId,
        alertType: 'private message',
        playerInfo: playerInfo,
      });
      await privateMsgInfo.save();

      let toIdInfo = await Account.findOne({ accountId: toId });
      io.to(toIdInfo.socketId).emit('receivePrivateMsg', privateMsgInfo, val);
    }
  });

  //phaser
  socket.on("map", async (accountId) => {
    await Account.findOneAndUpdate(
      { accountId: accountId },
      {
        socketId: socket.id
      },
      { new: true }
    );
  });

  socket.on("join", async (mode, address, targetPos, x, y, n, m, accountId) => {
    // view mode
    if (mode == 'view') {
      let player = await Account.findOneAndUpdate(
        { accountId: accountId },
        {
          address: address,
          targetPos: targetPos,
          x: x,
          y: y,
          n: n,
          m: m,
          connectState: true,
          socketId: socket.id
        },
        { new: true }
      );

      let place = await Place.findOne({ address: address, pos: targetPos });
      await Place.findOneAndUpdate(
        { address: place.address, pos: place.pos },
        {
          buildingCount: place.buildingCount,
          score: place.score + 5,
          totalVisitor: ++place.totalVisitor,
          currentVisitor: ++place.currentVisitor
        },
        { new: true }
      );

      // Get players in the same address
      let players = await Account.find({ address: address });

      let buildingList = await Placement.find({ address: address });
      socket.emit("mapInit", player, buildingList);
      socket.emit("currentPlayers", players);
      socket.broadcast.emit("newPlayer", player);
    }
    else if (mode == 'construction') {
      // construction mode
      let buildingList = await Placement.find({ address: address });
      socket.emit("mapInit", buildingList);
    }
  });

  // Get building Info
  socket.on('getBuildingInfo', async () => {
    let buildingInfo = await Building.find({});

    if (buildingInfo.length == 0) {
      for (let i = 0; i <= 87; i++) {
        if (i >= 0 && i <= 6) {
          buildingInfo = new Building({
            index: i,
            type: 'ground',
            url: '/buildings/ground/g(' + i + ').png',
            default: true,
            size: '1*1',
            cost: 0
          });
        }
        else if (i >= 7 && i <= 56) {
          buildingInfo = new Building({
            index: i,
            type: 'road',
            url: '/buildings/road/r (' + (i - 6) + ').png',
            default: true,
            size: '1*1',
            cost: 0
          });
        }
        else {
          let buildingSize;
          if (i >= 73 && i <= 86)
            buildingSize = '2*2';
          else
            buildingSize = '1*1';

          buildingInfo = new Building({
            index: i,
            type: 'building',
            url: '/buildings/building/b (' + (i - 56) + ').png',
            default: true,
            size: buildingSize,
            cost: 0
          });
        }
        await buildingInfo.save();
      }
      buildingInfo = await Building.find({});
    }
    socket.emit("setBuildingInfo", buildingInfo);
  });

  socket.on('getPlaceInfo', async (address, pos, nftdata) => {
    let placeOwner = await Account.findOne({ accountId: nftdata.owner });

    let place = await Place.findOne({ address: address, pos: pos });
    if (!place) {
      place = new Place({
        address: address,
        pos: pos,
        token_id: nftdata.token_id,
        serialNumber: nftdata.serial_number,
        owner: nftdata.owner,
        avatarUrl: placeOwner.avatarUrl,
        buildingCount: 0,
        score: 0,
        totalVisitor: 0,
        currentVisitor: 0
      });
      await place.save();
    }
    else {
      place = await Place.findOneAndUpdate(
        { address: address, pos: pos },
        {
          avatarUrl: placeOwner.avatarUrl,
        },
        { new: true }
      )
    }

    socket.emit('sendPlaceInfo', place);
  });

  socket.on("chating", async (chatContent, playerId) => {
    socket.broadcast.emit("chating", chatContent, playerId);
  });

  socket.on("emojing", async (emoji, playerId) => {
    socket.broadcast.emit("emojing", emoji, playerId);
  });

  socket.on("playerMovement", async (target, accountId) => {
    let player = await Account.findOne({ accountId: accountId });

    var tilem = target.tilem;
    var tilen = target.tilen;
    // emit a message to all players about the player that moved
    socket.broadcast.emit("playerMoved", player, tilem, tilen);
  });

  socket.on("playerPosition", async (posInfo, n, m, accountId) => {
    console.log(n, m, accountId);
    let player = await Account.findOneAndUpdate(
      { accountId: accountId },
      {
        x: posInfo.x,
        y: posInfo.y,
        n: n,
        m: m
      },
      { new: true }
    );
  });

  socket.on("setRoad", async (building) => {
    let newBuilding = new Placement({
      address: building.address,
      pos: building.pos,
      sno: building.sno,
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
    let newBuilding = new Placement({
      address: building.address,
      pos: building.pos,
      sno: building.sno,
      type: building.type,
      built: building.built,
      remaintime: building.remaintime,
      ads: building.ads,
      linkurl: '',
      owner: building.owner
    });
    // Save user to DB
    await newBuilding.save();

    // Refresh place info
    let place = await Place.findOne({ address: building.address, pos: building.pos });
    if (place) {
      place = await Place.findOneAndUpdate(
        { address: building.address, pos: building.pos },
        {
          buildingCount: ++place.buildingCount,
          score: place.score + 5
        },
        { new: true }
      );
    }

    socket.broadcast.emit("changeMap", newBuilding);

    let count = building.remaintime + 1;
    let interval = setInterval(async () => {
      count--;

      let build = await Placement.findOne({ address: building.address, sno: building.sno, type: building.type });
      if (build) {
        build = await Placement.findOneAndUpdate(
          { address: building.address, sno: building.sno, type: building.type },
          { remaintime: count - 1 },
          { new: true }
        );
        socket.emit("buildingTime", build);
      }

      /**
       * building completion
       */
      if (count == 1) {
        let build = await Placement.findOne({ address: building.address, sno: building.sno, type: building.type });
        if (build) {
          build = await Placement.findOneAndUpdate(
            { address: building.address, sno: building.sno, type: building.type },
            { built: true },
            { new: true }
          );
        }
        io.emit("buildingCompletion", build);
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

      let build = await Placement.findOne({ address: building.address, sno: building.sno, type: building.type });
      if (build) {
        build = await Placement.findOneAndUpdate(
          { address: building.address, sno: building.sno, type: building.type },
          { remaintime: count - 1 },
          { new: true }
        );
        socket.emit("in-buildingTime", build);
      }

      /**
       * building completion
       */
      if (count == 1) {

        clearInterval(interval);
        io.emit("in-buildingCompletion", building);
        let build = await Placement.findOne({ address: building.address, sno: building.sno, type: building.type });
        if (build) {
          build = await Placement.findOneAndUpdate(
            { address: building.address, sno: building.sno, type: building.type },
            { built: true },
            { new: true }
          );
        }
      }
    }, 1000);
  });

  socket.on("building_destroy", async (sno, address) => {
    await Placement.findOneAndRemove({ sno: sno, address: address });
    socket.broadcast.emit("building_destroy", address, sno);
  });

  socket.on("setLink", async (sno, address, url) => {
    await Placement.findOneAndUpdate(
      { sno: sno, address: address },
      { linkurl: url },
      { new: true }
    );
  });

  socket.on("disconnect", async () => {
    console.log("user disconnected: ");
    if (socket.id != null) {
      let player = await Account.findOneAndUpdate(
        { socketId: socket.id },
        {
          address: '',
          targetPos: 0,
          x: 0,
          y: 0,
          n: 0,
          m: 0,
          socketId: '',
          connectState: false
        }
      );

      if (player != null) {
        console.log("user disconnected: ", player.accountId);
        // Refresh place info
        /*    place = await Place.findOneAndUpdate(
              { address: place.address, pos: place.pos },
              {
                currentVisitor: --place.currentVisitor
              },
              { new: true }
            );*/
        socket.broadcast.emit("disconnected", player);
      }
    }
    socket.disconnect();
  });
});

server.listen(3306, () => 'Server is running on port 3306');