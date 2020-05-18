import { DiscordPlugin } from "./Plugin";
import { Message } from "discord.js";

export class Help extends DiscordPlugin
{
    constructor()
    {
        super();
        this.setCommand("help");
        this.setDescription("Shows Help");
    }

    public xferMsg(cmd: Message, o: Array<string>)
    {
        let buffer = "";

        for (let v in this.commands)
        {
            buffer += "!" + v + " - " + this.commands[v].desc + "\n";
        }
        cmd.channel.send(buffer.toString());
    }
}