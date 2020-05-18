import { Client, Message } from 'discord.js';

import * as fs from "fs";

import { MemeBot }from './MemeBot';

import { Dadjoke } from './Dadjoke';

import { Plugin } from './PluginHeader';

class Main extends Client 
{
    private commands:{[key: string]: Plugin} = {};

    constructor()
    {
        super();

        this.login(process.env.USERTOKEN).catch((reason) => {
            console.log(reason);
            console.log("Maybe the token is wrong? (Make sure it is a bot token)");
        });

        this.on('ready', () => {
            console.log(`Logged in as ${this.user!.tag}`);
        });

        this.on('message',(msg) => {
            if (msg.content[0] === '!')
            {
                this.pushMessage(msg);
            }
        });

        let meme:MemeBot = new MemeBot();
        this.addModule(meme);

        this.addModule(new Dadjoke());
    }

    private addModule(mod:Plugin)
    {
        if (mod === null || mod.command === undefined) throw new Error("Not a valid module");
        //debugger;

        this.commands[mod.command] = mod;
    }

    private pushMessage(cmd:Message)
    {

        let o = {
            cmd: cmd.content.substring(1),
            args: cmd.content.split(" ").slice(1)
        }

        console.log(o);

        if (this.commands[o.cmd] !== undefined) this.commands[o.cmd].xferMsg(cmd, o.args);
    }
}

new Main();