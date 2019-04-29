// init discord lib
const settings = require('./settings.json');
const package = require('./package.json');
const commands = require('./commands.js');
const tools = require('./tools.js');
const Discord = require('discord.js');
const client = new Discord.Client();
const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to bot database');
});

db.serialize(function() {
  db.run('CREATE TABLE if not exists users(id TEXT, points INTEGER, UNIQUE(id))');
});

var debug = true;

// actions
client.on('ready', async () => {
  db.serialize(function() {
    var u, user;
    for (u in client.users.array()) {
      user = client.users.array()[u];
      db.run('INSERT OR IGNORE INTO users(id, points) VALUES(?,?)', user.id.toString(), 100);
    }
  });
  console.log('mbot v' + package.version + " has been enabled.");
  //game
  client.user.setPresence({
    satus: 'online',
    game: {
      name: 'Minecraft'
    }
  });
  if (debug) {
    try {
      let link = await client.generateInvite(["ADMINISTRATOR"]);
      console.log(link);
    } catch (err) {
      console.log(err);
    }
  }
  /*setInterval(function() {
    db.each('SELECT * FROM users', function(err, row) {
      var uPoints;
      var u, user;
      for (u in client.users.array()) {
        uPoints = row.points + 10;
        user = client.users.array()[u];
      }
      tools.setPoints(uPoints, user.id.toString());
      console.log('Updated ' + user.id.toString() + ' to ' + uPoints);
    });
  }, 30000);*/
});

commands.registerCommands(client);
//login to the client
client.login(settings.token);