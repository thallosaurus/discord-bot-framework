import * as https from 'https';
import { Message } from 'discord.js';

export class DiscordPlugin {
    private pluginCommand: string = "";

    private pluginDescription: string = "no description set";

    public commands:{[key: string]: DiscordPlugin} = {};

    get command()
    {
        return this.pluginCommand;
    }

    get desc()
    {
        return this.pluginDescription;
    }

    constructor() {}

    public setCommand(cmd:string)
    {
        this.pluginCommand = cmd;
    }

    public setDescription(desc:string)
    {
        this.pluginDescription = desc;
    }

    async request(options: any, data?: any) {
        return new Promise((resolve, reject) => {
            let req = https.request(options, res => {
                res.setEncoding("utf8");

                let body = "";
                res.on("data", data_ => {
                    body += data_;
                });

                res.on("end", () => {
                    resolve(JSON.parse(body));
                });

                res.on("error", (e) => {
                    reject(e);
                });
            });
            if (options.method == "POST") {
                req.write(data);
            }
            req.end();
        });
    }

    public xferMsg(cmd: Message, o: Array<string>){}

    public addReference(c:any){
        this.commands = c.commands;
    }
}