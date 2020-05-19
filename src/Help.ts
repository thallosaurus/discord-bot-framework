import { DiscordPlugin, Argument } from "./Plugin";
import { Message } from "discord.js";

export class Help extends DiscordPlugin
{
    constructor()
    {
        super();
        this.setCommand("help");
        this.setDescription("Shows this Help");
    }

    public xferMsg(cmd: Message, o:Argument)
    {
        let buffer = "";

        for (let v in this.commands)
        {
            buffer += "!" + v + " - " + this.commands[v].desc + "\n"
            //+ this.commands[v].usage + "\n\n";
            ;
        }
        buffer += "\nCreated by @thallosaurus. GitHub: https://github.com/thallosaurus/discord-bot-framework";
        cmd.channel.send(buffer.toString());
    }
}