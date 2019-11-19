import { Category } from "../util/command";
import { inspect } from 'util'
import { client } from "../index";

// Ignore the fact imports and variables are unused. These are eval shortcut variables.
export const ownerCommands: Category = {
    jseval: {
        name: "jseval",
        description: "Eval JS code. Not for anyone except for Lava.",
        aliases: [],
        usage: ">>jseval <code...>",
        owner: true,
        minArgsRequired: 1,
        execute: async (msg, args) => {
            const message = msg
            const author = msg.author
            const member = msg.member
            const argsRaw = args.join(" ")
            try {
                let toEval = argsRaw
                // Remove extra characters.
                if (toEval.startsWith('`')) toEval = toEval.substring(1)
                if (toEval.startsWith('``js')) toEval = toEval.substring(4)
                else if (toEval.startsWith('``')) toEval = toEval.substring(2)
                if (toEval.endsWith('`')) toEval = toEval.substring(0, toEval.length - 1)
                if (toEval.endsWith('``')) toEval = toEval.substring(0, toEval.length - 2)

                const res = inspect(await Promise.resolve(eval(toEval)))

                msg.addReaction('✅')
                if (res !== 'undefined') return `${'```'}${res}${'```'}`
            } catch (e) {
                const channel = await client.getDMChannel(author.id)
                msg.addReaction('❌')
                channel.createMessage(`**Error:**\n${e}`)
            }
        }
    },
    setgame: {
        name: "setgame",
        description: "Set the bot game.",
        aliases: ["game", "playing"],
        usage: ">>setgame <status> <type> <game...> [streaming::true|false]",
        owner: true,
        minArgsRequired: 2,
        execute: (_msg, args) => {
            let url: string | undefined = undefined
            let type = 0
            if (args[1] == "playing") type = 0
            else if (args[1] == "streaming") {
                type = 1
                url = "https://twitch.tv/baclavaisveryniceabcdefghijklmnop"
            } else if (args[1] == "listening") type = 2
            else if (args[1] == "watching") type = 3
            else return "Invalid type. Available types: `playing, streaming, listening, watching`."
            client.editStatus(args[0], {name: args.slice(2).join(" "), type: type, url: url})
            return "Game changed successfully."
        }
    }
}