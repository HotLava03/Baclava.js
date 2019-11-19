import { Message, MessageContent, EmbedOptions } from "eris"
import { basicCommands } from "../commands/basic-commands"
import { utilCommands } from "../commands/util-commands"
import { ownerCommands } from "../commands/owner-commands"

export type Command = {
    name: string
    description: string
    aliases: Array<string>
    usage: string
    example?: CommandExample
    minArgsRequired: number
    execute: CommandExecutor
    owner?: boolean
}

export type Category = {
    [name: string]: Command
}

export type Commands = {
    [name: string]: Command
}

export type CommandExample = {
    input: string
    output: string | MessageContent
}

export type CommandExecutor = (msg: Message, args: Array<string>) => MessageContent | Promise<EmbedOptions> | Promise<void> | Promise<MessageContent> | Promise<string | undefined>

export function getCommandByName(name: string): Command | null {
    for (const commandName in commands) {
        if (commandName == name.toLowerCase())
            return commands[commandName]
        else
            for (let i = 0; i < commands[commandName].aliases.length; i++)
                if (commands[commandName].aliases[i] == name.toLowerCase())
                    return commands[commandName]
    }
    return null
}

export let commands: Commands = {}
export function initCommands() {
    registerCategory(basicCommands)
    registerCategory(utilCommands)
    registerCategory(ownerCommands)
}

export function registerCategory(category: Category) {
    for (const name in category)
        commands[name] = category[name]
}

export function helpGen() {
    let help = ''
    for (const name in commands)
        help += `**${name}** - ${commands[name].description}\n`
    require('./constants').HELP = help
}