import { client } from "../index";
import { Category, getCommandByName, commands } from "../util/command";
import { HELP, ORANGE, VERSION } from "../util/constants";
import { getUptime } from "../util/misc-utils";
import { isNullOrUndefined } from "util";

export const basicCommands: Category = {
    help: {
        name: "help",
        description: "Get Baclava help",
        aliases: ["halp", "fuckinghelpme"],
        usage: ">>help [command name]",
        example: {
            input: ">>help regex",
            output: {embed: {
                title: "Regex",
                color: ORANGE,
                fields: [
                    {
                        name: "Description",
                        value: "Use regular expressions in a discord bot",
                        inline: false
                    },
                    {
                        name: "Usage",
                        value: ">>regex [-i,-g] <regular expression>\n<input>\n[replaceWith?|-r|-remove]",
                        inline: false
                    },
                    {
                        name: "Aliases",
                        value: ["regexp", "reg", "regularexpression"].join(", "),
                        inline: false
                    }
                ]
            }}
        },
        minArgsRequired: 0,
        execute: (msg, args) => {
            if (args.length == 0)
                return {
                    embed: {
                        author: {
                            name: msg.author.username + "#" + msg.author.discriminator,
                            icon_url: msg.author.avatarURL
                        },
                        title: "Baclava help",
                        description: HELP,
                        color: ORANGE,
                        timestamp: new Date().toISOString(),
                    }
                };

            const command = getCommandByName(args[0])      
                
            if (command == null)
                return "❌ | Command not found."   

            return {
                embed: {
                    author: {
                        name: msg.author.username + "#" + msg.author.discriminator,
                        icon_url: msg.author.avatarURL
                    },
                    title: "Help for command: " + command.name,
                    fields: [
                        {
                            name: "Description",
                            value: command.description,
                            inline: false
                        },
                        {
                            name: "Usage",
                            value: command.usage,
                            inline: false
                        },
                        {
                            name: "Aliases",
                            value: command.aliases.join(", "),
                            inline: false
                        }
                    ],
                    color: ORANGE 
                }
            }    
        }
    },
    ping: {
        name: "ping",
        description: "Ping the bot",
        aliases: ["lag"],
        usage: ">>ping",
        minArgsRequired: 0,
        execute: async (msg, _args) => {
            const time = new Date().getMilliseconds()
            const sent = await msg.channel.createMessage("Pinging...")
            const ping = Math.abs((new Date().getMilliseconds() - time) / 2)
            sent.edit(`**Pong!** Baclava has a ping of \`${ping}\`ms.`)
        }
    },
    info: {
        name: "info",
        description: "Get information about Baclava.js",
        aliases: ["ver", "version", "about", "inf"],
        usage: ">>info",
        minArgsRequired: 0,
        execute: async (_msg, _args) => {
            const self = await client.user
            const now = new Date()
            return {embed: {
                author: {
                    name: "Baclava",
                    icon_url: self.avatarURL
                },
                fields: [
                    {
                        name: "Version",
                        value: VERSION,
                        inline: true
                    },
                    {
                        name: "Libraries",
                        value: "Eris, JDA",
                        inline: true
                    },
                    {
                        name: "Author",
                        value: "HotLava03",
                        inline: true
                    }
                ],
                color: ORANGE,
                timestamp: now.toISOString(),
                footer: {
                    text: getUptime(client)
                }
            }}
        }
    },
    uptime: {
        name: "uptime",
        description: "Retrieve Baclava's uptime.",
        aliases: ["ot", "ut", "onlinetime"],
        usage: ">>uptime",
        minArgsRequired: 0,
        execute: async (_msg, _args) => {
            return getUptime(client)
        }
    },
    example: {
        name: "example",
        description: "Get an example of a specific command.",
        aliases: ["ex"],
        usage: ">>example <command name>",
        example: {
            input: ">>example help",
            output: {
                content: "**Input** - `>>example help`\n**Output**",
                embed: {
                    title: "Help for command: regex",
                    color: ORANGE,
                    fields: [
                        {
                            name: "Description",
                            value: "Use regular expressions in a discord bot",
                            inline: false
                        },
                        {
                            name: "Usage",
                            value: ">>regex [-i,-g] <regular expression>\n<input>\n[replaceWith?|-r|-remove]",
                            inline: false
                        },
                        {
                            name: "Aliases",
                            value: ["regexp", "reg", "regularexpression"].join(", "),
                            inline: false
                        }
                    ]
                }
            }
        },
        minArgsRequired: 1,
        execute: (_msg, args) => {
            const command = getCommandByName(args[0])
            if (command == null)
                return "❌ | Command not found."
            else if (command.example == null)
                return "❌ | This command does not have examples."    

            if (typeof command.example.output === 'string')
                return "**Input** - `" + command.example.input + "`\n**Output** - " + command.example.output
            else    
                return {
                    content: "**Input** - `" + command.example.input + "`\n**Output**\n",
                    embed: command.example.output.embed
                }
        }
    },
    examples: {
        name: "examples",
        description: "Retrieve all command names that have an example.",
        aliases: [],
        usage: ">>examples",
        minArgsRequired: 0,
        execute: (_msg, _args) => {
            const examples: string[] = ["No commands have an example... sad"] // this position is removed when an example is found as it's on index 0 and i == 0
            let i = 0
            for (const name in commands)
                if (commands[name].example !== undefined)
                    examples[i++] = name
            return {embed: {
                title: "Commands that have an example.",
                description: examples.join(", "),
                timestamp: new Date().toISOString(),
                color: ORANGE,
                footer: {
                    text: "Use >>example <command> to see the example."
                }
            }}        
        }
    }
}