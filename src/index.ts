import { Message, MessageContent, Client } from 'eris'
import { VERSION } from './util/constants'
import { initCommands, helpGen, getCommandByName } from './util/command'

export const client = new Client(process.env.TOKEN!!)

console.info("[Baclava.js]|[Init] Connect...")
client.connect()

client.on("ready", () => {
    console.info("[Baclava.js]|[Init] Connected. Startup tasks...")
    initCommands() // register all commands
    helpGen() // generate the help command based on the commands
    client.editStatus("online", {name: "baclava in an oven", type: 1, url: "https://twitch.tv/abcdefgbaclavaisnicehijklmnop"})
    console.info(`[Baclava.js]|[Init] Baclava.js ${VERSION} loaded successfully. Event listeners are ready.`)
})

client.on("messageCreate", async (message: Message) => {
    if (message.content.startsWith(">>")) {
        // get the name of the command when executed
        const name = message.content.toLowerCase().match(/^>>\s{0,}\w+\s{0,1}/)!![0].replace(/>>\s{0,}/, "").replace(/\s{0,1}$/, "")
        // get the actual command through its name, null if it doesn't exist
        const command = getCommandByName(name)
        if (command === null)
            return // don't care if it's null then, stop it right here
        if (command.owner === true && message.author.id != "362753440801095681") // owner-commands.ts
            return await message.channel.createMessage("nah")

        const args = message.content.replace(/^>>\s{0,}\w+\s{0,1}/, "")    
        const splitArgs = args === "" ? [] : args.split(" ") // this is because some commands may rely on \n for example. Therefore, not using \s.

        // verify if usage is correct; if not, send the usage.    
        if (splitArgs.length < command.minArgsRequired)
            return await message.channel.createMessage(`Invalid usage for ${command.name}: \`${command.usage}\``)
        // all good, let's try to execute    
        try {
            const toSend = await command.execute(message, splitArgs) // execute the command
            if (toSend != undefined) message.channel.createMessage(toSend as MessageContent) // returned a string/valid MessageContent object? Go ahead and send it then.
        } catch (e) { 
            console.log(`An internal error has occured while running ${name.toLowerCase()}:\n${e}`)
            message.channel.createMessage(`Whoops... Sounds like some baclava burned. || An internal error has occured: ${e}||`) // let's be nice and not ignore the user if something goes wrong.
        }
    }
})