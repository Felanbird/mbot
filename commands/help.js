const Discord = require('discord.js');

module.exports = {
  name: 'help',
  execute(message, args) {
    var page = 0;
    var min = 1;
    var max = 3;
    const embed = new Discord.RichEmbed()
      .setTitle('Commands')
      .addField('!help', 'Returns a list of commands for this bot')
      .addField('!ping', 'Returns pong')
      .addField('!userinfo', 'Returns userinfo about yourself')
      .addField('!random <subreddit> [time] [search]', 'Returns a random thread from a subreddit')
      .addField('!anal', 'Returns an anal image')
      .addField('!ass', 'Returns an image of an ass')
      .addField('!blowjob', 'Returns a blowjob image')
      .addField('!boobs', 'Returns a picture of a pair of milkers')
      .setFooter('Requested by: ' + message.author.username + " (1/3)");
    //console.log(page);
    message.channel.send(embed).then(async sent => {
      await sent.react("◀");
      await sent.react("▶");
      sent.awaitReactions(reaction => {
        if (reaction.emoji.name === "◀") {
          reaction.remove(message.author);
          page--;
        } else if (reaction.emoji.name === "▶") {
          reaction.remove(message.author);
          page++;
        }

        switch (page) {
          case 1:
            const embed1 = new Discord.RichEmbed()
              .setTitle('Commands')
              .addField('!help', 'Returns a list of commands for this bot')
              .addField('!ping', 'Returns pong')
              .addField('!test', 'A test command')
              .addField('!userinfo', 'Returns userinfo about yourself')
              .addField('!random <subreddit> [time] [search]', 'Returns a random thread from a subreddit')
              .addField('!anal', 'Returns an anal image')
              .addField('!ass', 'Returns an image of an ass')
              .addField('!blowjob', 'Returns a blowjob image')
              .addField('!boobs', 'Returns a picture of a pair of milkers')
              .setFooter('Requested by: ' + message.author.username + " (1/3)");
            //console.log(page);
            sent.edit(embed1);
            break;
          case 2:
            const embed2 = new Discord.RichEmbed()
              .setTitle('Commands')
              .addField('!hardcore', 'Returns a hardcore porn image')
              .addField('!hentai', 'Returns a hentai image')
              .addField('!nsfw', 'Returns an nsfw image (Straight)')
              .addField('!pegging', 'Returns a pegging image')
              .addField('!rule34', 'Returns a rule34 image')
              .addField('!thighs', 'Retuns an image of thighs')
              .addField('!trap', 'Returns a trap image')
              .setFooter('Requested by: ' + message.author.username + " (2/3)");
            //console.log(page);
            sent.edit(embed2);
            break;
          case 3:
            const embed3 = new Discord.RichEmbed()
              .setTitle('Commands')
              .addField('!dick', 'Returns an image of a dick')
              .addField('!gay', 'Returns a gay porn image')
              .setFooter('Requested by: ' + message.author.username + " (3/3)");
            //console.log(page);
            sent.edit(embed3);
            break;
            // more help pages start here
        }

        if (page > max) {
          page = 3;
        }

        if (page < min) {
          page = 1;
        }
      }, {
        time: 20000
      });
    });
  },
};