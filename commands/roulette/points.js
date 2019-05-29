const sqlite = require('sqlite3').verbose();
const tls = require('../../tools');
const tools = new tls.Tools();

const db = new sqlite.Database('./mbot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

module.exports.cooldown = 0;

module.exports = {
  name: 'points',
  usage: '[user]',
  description: `Returns the designated user's points`,
  execute(message, args) {
    db.serialize(() => {
      if (args.length === 0) {
        db.get('SELECT points points FROM users WHERE id = ' + message.author.id.toString(), (err, row) => {
          if (err) {
            return console.log(err);
          }
          return message.reply('You have ' + row.points.toString() + ' points!');
        });
      }
      if (args.length > 0) {
        tools.addCooldown(module.exports.name, 3, message);
        db.get('SELECT points points FROM users WHERE id = ' + message.mentions.users.first().id.toString(), (err, row) => {
          if (err) {
            return message.reply('No such user exists!');
          }
          return message.reply(message.mentions.users.first().username + ' has ' + row.points.toString() + ' points!');
        });
      }
    });
  },
};