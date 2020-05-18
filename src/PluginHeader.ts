import { Message, TextChannel } from "discord.js";

export interface Plugin
{
    command:string;
    xferMsg(cmd:Message, o:Object) : void;
}