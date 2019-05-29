const tls = require('../tools');
const suggestions = new tls.File('suggestions', './', 'json');

module.exports = {
    name: 'suggestions',
    usage: '[clear]',
    description: 'Check the suggestions, (include <clear> [admin only] to clear the suggestions)',
    owner: true,
    execute(message, args, client, prefix) {
        if (args.length === 0) {
            const current = suggestions.read();
            for (const i in current) {
                message.channel.send(current[i].suggestion + '\n' + current[i].by);
            }
            return;
        }
        if (args[0] === "clear") {
            suggestions.write([], () => {
                return message.channel.send('Cleared suggestions list.');
            });
        } else {
            return message.channel.send(`Invalid usage! ${prefix}suggestions [clear]`);
        }
    },
};