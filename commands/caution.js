// ./commands/caution.js
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
    name: 'caution',
    aliases: ['warning', 'attention'],
    category: 'fun',

    async execute({ sock, msg, args, jid }) {
        const query = args.join(' ');
        if (!query || query.trim().length < 2) {
            return sock.sendMessage(jid, {
                text: '⚠️ *Caution Banner*\n\n⚡ *Usage:* .caution <text>\n\n✨ *Examples:*\n.caution Wet Floor\n.caution Caution: Bot Zone',
                contextInfo: STYLE,
            }, { quoted: msg });
        }

        try {
            await sock.sendMessage(jid, { react: { text: '⚠️', key: msg.key } });
            
            const url = `https://api.popcat.xyz/v2/caution?text=${encodeURIComponent(query)}`;
            const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
            const buffer = Buffer.from(response.data);

            await sock.sendMessage(jid, {
                image: buffer,
                caption: `⚠️ *Caution*\n\n💬 ${query}\n\n⚡ _MATRIX4-XMD AI_`,
                contextInfo: STYLE,
            }, { quoted: msg });

            await sock.sendMessage(jid, { react: { text: '✅', key: msg.key } });
        } catch (err) {
            console.log(`❌ Caution error: ${err.message}`);
            await sock.sendMessage(jid, { react: { text: '❌', key: msg.key } });
            return sock.sendMessage(jid, {
                text: '❌ *Failed to generate caution banner.*\n\nTry again later.',
                contextInfo: STYLE,
            }, { quoted: msg });
        }
    }
};
