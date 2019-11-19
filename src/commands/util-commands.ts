import { ORANGE, IRREGULAR_ARGS } from "../util/constants"
import { Category } from "../util/command"

export const utilCommands: Category = {
    regex: {
        name: "regex",
        description: "Use regular expressions in a discord bot",
        aliases: ["regexp", "reg", "regularexpression"],
        usage: ">>regex /<regular expression>/[flags...]\n<input>\n[replaceWith?|-r|-remove]",
        example: {
            input: ">>regex -i -g ^hElLo\nHello world!\nGoodbye",
            output: {embed: {
                author: {
                    name: "Lava#0654"
                },
                fields: [
                    {
                        name: "Input",
                        value: "Hello world!",
                        inline: false
                    },
                    {
                        name: "Regex",
                        value: "/^hElLo/",
                        inline: true
                    },
                    {
                        name: "Matches",
                        value: "hello",
                        inline: false
                    },
                    {
                        name: "Replace Result",
                        value: "Goodbye world!",
                        inline: true
                    }
                ],
                color: ORANGE,
                footer: {
                    text: "Today at 25:60 PM"
                }
            }}
        },
        minArgsRequired: IRREGULAR_ARGS, // because the args in regex are separated by \n
        execute: (msg, args) => {
            const now = new Date()
            if (args.join(" ").split("\n").length <= 1)
                return {embed: {
                    author: {
                        name: msg.author.username + "#" + msg.author.discriminator,
                        icon_url: msg.author.avatarURL
                    },
                    title: "Regex Usage",
                    description: `${utilCommands.regex.usage}\n\n**Note:** If you don't know how regex works, you can still use it as if you were searching for text in a certain input.\n>>regex /text/ig`,
                    color: ORANGE,
                    timestamp: now.toISOString(),
                    footer: {
                        text: "Use >>example regex for a usage example."
                    }
                }}
            const rawExp = args.join(" ").split("\n")[0].replace(/^\//, "").replace(/\/\w{0,}$/, "")
            const flags = args.join(" ").split("\n")[0].replace(/^\/.{0,}\//, "")
            let regex: RegExp
            try {
                regex = new RegExp(rawExp, flags)
            } catch (e) {
                return "Invalid regular expression."
            }
            const input = args.join(" ").split("\n")[1]
            const replace = args.join(" ").split("\n")[2]
            let replaceString = "(did not replace)"
            if (!regex.test(input)) return `\'${input}\' does not match \'${regex}\'.`
            let matchString = input.match(regex)!!.join(", ")
            if (replace != undefined && !(replace == "-r" || replace == "-remove"))
                replaceString = input.replace(regex, replace)
            else if (replace == "-r" || replace == "-remove")
                replaceString = input.replace(regex, "")
            return {embed: {
                author: {
                    name: msg.author.username + "#" + msg.author.discriminator,
                    icon_url: msg.author.avatarURL
                },
                fields: [
                    {
                        name: "Input",
                        value: input.toString(),
                        inline: false
                    },
                    {
                        name: "Regex",
                        value: regex.toString(),
                        inline: true
                    },
                    {
                        name: "Matches",
                        value: matchString.toString(),
                        inline: false
                    },
                    {
                        name: "Replace Result",
                        value: replaceString.toString(),
                        inline: true
                    }
                ],
                color: ORANGE,
                timestamp: now.toISOString(),
            }}
        }
    }
}