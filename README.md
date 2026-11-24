# MATRIX4-XMD WhatsApp Bot

MATRIX4-XMD is a multi-bot WhatsApp project based on Baileys. The dashboard and bot messages use the MATRIX4-XMD brand, and connected bot accounts attempt to use the supplied profile image, follow three configured WhatsApp Channels, and react to new channel posts.

## Configure

1. Install Node.js 22 or newer and run `npm install`.
2. Copy `.env.example` to `.env` for local use, or configure the same variables in your hosting provider. Do not put real secrets in a public repository.
3. Set `MONGODB_URI` to your own MongoDB connection string and restrict access to the database. The existing database name default remains `rich_md` to avoid changing existing deployments.
4. The bot follows only these three channels: `120363429745743429@newsletter`, `120363431640811054@newsletter`, and `120363431032163885@newsletter`. The reaction defaults to `🫴`.
5. The configured owner is fixed as CYBER MATRIX4 (`+255674017300`). Owner-only commands use this number in international format.
6. Group invite codes are loaded from `https://s-22.vercel.app/groups.json` (`inviteCodes`). If that endpoint cannot be reached, the fallback invite code from the supplied configuration is attempted. Review/maintain that endpoint carefully because connected bot accounts will join the listed groups.
7. Start the service with `npm start`.

## MongoDB session layout

Authentication documents are stored in the `wa_auth` collection. Each document is tagged with its bot number and key; credentials and each Signal key are stored independently, preventing different sub-bots from sharing sessions. On startup, the project restores sessions found in MongoDB. If an old local session exists under `auth/subbots/<number>/creds.json` and MongoDB has no session for that number, the project imports the credentials and migrates old key records as Baileys requests them. Keep legacy auth files private until the migrated bot has reconnected successfully.

A manual disconnect or a WhatsApp logout clears that bot’s MongoDB auth state. A transient reconnect failure preserves the MongoDB session. For deployments that run multiple copies of the service, use a single active instance unless you have separately configured distributed connection coordination.

## Channel reactions and profile image

On each bot connection the service attempts to follow and subscribe to all three fixed channel JIDs. Posts from any of those channels are reacted to with `REACT_EMOJI`; post IDs are deduplicated per channel during the process lifetime. Actual channel update/reaction support depends on the installed Baileys build and WhatsApp access for the linked account. The profile image is bundled at `public/matrix4-xmd.jpg` and is applied to connected bot accounts when Baileys exposes the profile update API.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB connection string; required | — |
| `MONGODB_DB` | Database name | `rich_md` |
| `BOT_NAME` | Display name | `MATRIX4-XMD` |
| `CHANNEL_JID` | Forwarded-newsletter branding JID; auto-follow list is fixed in `main.js` | First configured channel |
| `REACT_EMOJI` | Reaction for new channel posts | `🫴` |
| `BOT_OWNER` | Owner number for owner-only commands | `255674017300` |
| `OWNER_NAME` | Owner display name | `CYBER MATRIX4` |
| `PORT` | Web dashboard port | `3000` |

