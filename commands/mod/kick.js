const {
    Tools,
} = require('../../tools');
const tools = new Tools();

module.exports = {
    name: 'kick',
    usage: '<player> [reason]',
    description: 'Kicks specified user',
    cooldown: 3,
    args: true,
    minArgs: 1,
    mod: true,
    permissions: ['KICK_MEMBERS'],
    execute(message, args, client) {
        const canKickBot = message.channel.permissionsFor(message.guild.member(client.user)).has('KICK_MEMBERS');
        if (!canKickBot) {
            return message.channel.send('The bot does not have permission to do this.');
        }
        const mention = tools.parseMention(args[0], client);
        if (!mention) {
            return message.channel.send(`${message.author} Could not find that user!`);
        }
        const hasAdmin = message.channel.permissionsFor(message.guild.member(mention)).has('ADMINISTRATOR');
        const admin = message.channel.permissionsFor(message.member).has('ADMINISTRATOR');
        if (hasAdmin && !admin) {
            return message.channel.send(`${message.author} You don't have permission to kick that user!`);
        }
        const mRole = message.guild.member(mention).roles.highest;
        const role = message.member.roles.highest;
        if (mRole.comparePositionTo(role) > 0 || mRole.position === role.position) {
            return message.channel.send(`${message.author} That user has a higher role than you!`);
        }
        const botRole = message.guild.member(client.user).roles.highest;
        if (mRole.comparePositionTo(botRole) > 0 || mRole.position === botRole.position) {
            return message.channel.send(`${message.author} That user has a higher role than me!`);
        }
        if (!message.guild.member(mention).kickable) {
            return message.channel.send(`${message.author} This member can't be kicked!`);
        }
        if (!args[1]) {
            return message.guild.member(mention).kick(`Kicked by: ${message.author.username}`).then((member) => {
                message.channel.send(`${message.author} Kicked user ${member.user}!`);
            }).catch(() => {
                return message.channel.send('Sorry, it seems an error occurred.\nMaybe check my permissions?');
            });
        } else {
            const kickReason = args.slice(1, args.length).join(' ');
            return message.guild.member(mention).kick(`Kicked by: ${message.author.username} Reason: ${kickReason}`).then((member) => {
                message.channel.send(`${message.author} Kicked user ${member.user}\nReason: ${kickReason}`);
            }).catch(() => {
                return message.channel.send('Sorry, it seems an error occurred.\nMaybe check my permissions?');
            });
        }
    },
};