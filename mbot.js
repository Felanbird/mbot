// init discord lib
const settings = require('./settings.json');
const package = require('./package.json');
const commands = require('./commands.js');
const tools = require('./tools.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const sqlite = require('sqlite3').verbose();
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

module.exports.event = new tools.Event();
let event = module.exports.event;

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to bot database');
});

let uptime = 0;

db.serialize(function () {
  db.run('CREATE TABLE if not exists users(id TEXT, points INTEGER, UNIQUE(id))');
});

client.on('guildMemberAdd', (guildMember) => {
  db.serialize(function () {
    db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', guildMember.user.id.toString(), 100);
    console.log('New user found, registering them to the bot database with ID of ' + guildMember.user.id.toString());
  });
});

client.on('guildMemberRemove', (guildMember) => {

});

// actions
client.on('ready', async () => {
  event.emit('ready');
  db.serialize(function () {
    var u, user;
    for (u in client.users.array()) {
      user = client.users.array()[u];
      db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', user.id.toString(), 100);
    }
  });
  console.log('mbot v' + package.version + " has been enabled.");
  //game | only allows for default emojis
  const games = ['Minecraft', 'Murdering Martine the BOT', 'nymnBridge PewDiePie', 'Acrozze a mega gay',
    'This bot was made by me 😃', 'help me'
  ];
  setInterval(function () {
    const randomStatus = games[Math.floor(Math.random() * games.length)];
    client.user.setPresence({
      satus: 'online',
      game: {
        name: randomStatus
      }
    });
  }, 60000);
  if (settings.debug) {
    try {
      let link = await client.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
    } catch (err) {
      console.log(err);
    }
  }
  /*setInterval(function () {
    db.serialize(function (err) {
      var uPoints;
      db.each("SELECT points points, id id FROM users", function (err, row) {
        if (err) {
          console.log(err);
        }
        var u, user;
        for (u in client.users.array()) {
          user = client.users.array()[u];
          tools.setPoints((row.points + 10), user.id.toString());
          return console.log("Set " + user.id.toString() + " to " + row.points);
        }
      });
    });
  }, 5000);*/
  //tools.contactAPI(client);
  event.on('newUser', (user, username, id) => {
    console.log(`New user: ${username} with discord ID of ${id} added to the API.`);
  });
  event.on('deleteUser', (user, username, id) => {
    console.log(`User ${username}:${id} has left the server, removing them from the API.`);
  });
});

setInterval(function () {
  uptime++;
  event.emit('uptimeUp');
}, 1000);

module.exports.getUptime = function () {
  return uptime;
}

event.on('filesLoaded', function () {
  console.log('Command files loaded!');
});

event.on('pointsUpdated', function (amnt, id) {
  console.log(`Set ${id}'s points to ${amnt}!`);
});

commands.registerCommands(client, this);
//login to the client

app.get('/suggestions', (req, res) => {
  fs.createReadStream('./suggestions.json', 'utf8').on('data', (chunk) => {
    let suggestions = JSON.parse(chunk);
    res.send(suggestions);
  });
});

app.listen(80);
client.login(settings.token);