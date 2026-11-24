// ./commands/alert.js
const axios = require('axios');

const STYLE = {
    forwardingScore: 350,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: (process.env.CHANNEL_JID || '120363429745743429@newsletter'),
        newsletterName: (process.env.BOT_NAME || 'MATRIX4-XMD'),
        serverMessageId: 202,
    },
};

module.exports = {
    name: 'alert',
    aliases: ['fakealert', 'iphonealert'],
    category: 'fun',

    async execute({ sock, msg, args, jid }) {
        const query = args.join(' ');
        if (!query || query.trim().length < 2) {
            return sock.sendMessage(jid, {
                text: '📱 *Fake iPhone Alert*\n\n⚡ *Usage:* .alert <text>\n\n✨ *Examples:*\n.alert Wake up!\n.alert This is a test',
                contextInfo: STYLE,
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(jid, { react: { text: '📱', key: msg.key } });
            
            const url = `https://api.popcat.xyz/v2/alert?text=${encodeURIComponent(query)}`;
            const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
            const buffer = Buffer.from(response.data);

            await sock.sendMessage(jid, {
                image: buffer,
                caption: `📱 *Fake Alert*\n\n💬 ${query}\n\n⚡ _MATRIX4-XMD AI_`,
                contextInfo: STYLE,
            }, { quoted: msg });

            await sock.sendMessage(jid, { react: { text: '✅', key: msg.key } });
        } catch (err) {
            console.log(`❌ Alert error: ${err.message}`);
            await sock.sendMessage(jid, { react: { text: '❌', key: msg.key } });
            return sock.sendMessage(jid, {
                text: '❌ *Failed to generate alert.*\n\nTry again later.',
                contextInfo: STYLE,
            }, { quoted: msg });
        }
    }
};
