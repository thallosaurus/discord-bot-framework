import { Client, Message } from 'discord.js';

import * as fs from "fs";

import { DiscordPlugin } from './Plugin';

import { Help } from './Help';

class Main extends Client 
{
    private commands:{[key: string]: DiscordPlugin} = {};

    /*private commandBlacklist = [
        "dad"
    ];*/

    constructor()
    {
        super();

        this.login(process.env.BOT_USERTOKEN).catch((reason) => {
            console.log(reason);
            console.log("Maybe the token is wrong? (Make sure it is a bot token)");
        });

        this.on('ready', () => {
            console.log(`Logged in as ${this.user!.tag}`);
        });

        this.on('message',(msg) => {
            if (msg.content[0] === '!' && !msg.author.bot)
            {
                this.pushMessage(msg);
            }
            console.log(msg);
        });

        this.addModule(new Help());

        this.importModules();
    }

    private addModule(mod:DiscordPlugin)
    {
        if (mod === null || mod.command === undefined) throw new Error("Not a valid module");

        console.log("Adding command !" + mod.command);

        mod.addReference(this);

        this.commands[mod.command] = mod;
    }

    private pushMessage(cmd:Message)
    {

        let o = {
            cmd: cmd.content.split(" ")[0].substring(1).toLowerCase(),
            args: cmd.content.split(" ").slice(1)
        }

        if (this.commands[o.cmd] !== undefined) this.commands[o.cmd].xferMsg(cmd, o.args);
    }

    private async importModules()
    {
        let dir = fs.readdirSync(process.cwd() + "/build/module");

        for (let i = 0; i < dir.length; i++)
        {
            let name = dir[i].split(".");

            if (name[name.length - 1] === "js")
            {
                let m:any = await require(process.cwd() + "/build/module/" + dir[i]);
                this.addModule(new m());
            }
        }
    }
}

new Main();