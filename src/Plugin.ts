import * as https from 'https';
import { Message } from 'discord.js';

export class DiscordPlugin {
    private pluginCommand: string = "";

    private pluginDescription: string = "no description set";

    private pluginUsage:string = "no usage set";

    public commands:{[key: string]: DiscordPlugin} = {};

    get command()
    {
        return this.pluginCommand;
    }

    get desc()
    {
        return this.pluginDescription;
    }

    get usage()
    {
        return this.pluginUsage;
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

    public setUsage(usage:string)
    {
        this.pluginUsage = usage;
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
                    //console.log(body);
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

    public xferMsg(cmd: Message, o: Argument){}

    public addReference(c:any){
        this.commands = c.commands;
    }
}

export class Argument
{

    //new
    //private regexp = /(?<cmd>![A-Z,a-z]+)(?<sub>(?: \(.+\)))?(?<args>.+)/;
    private regexp = /(?<cmd>![A-Z,a-z]+)(?<sub>(?: \(.+\)))?(?:(?<args>.+))?/;
    public cmd:string | null;
    public sub:string | null;
    public args:string[] | null;

    constructor(cmd:Message)
    {
        let exp = this.regexp.exec(cmd.content);
        this.cmd = exp!.groups!.cmd!.substring(1);
        this.sub = this.removeLeadingBrackets(exp!.groups!.sub!);
        //this.args = exp!.groups!.args || null;

        if (exp!.groups!.args != null)
        {
            this.args = exp!.groups!.args.substring(1).split(";");
        }
        else
        {
            this.args = null;
        }
    }

    private removeLeadingBrackets(str:string) : string | null
    {
        return str != undefined ? str.substring(1).replace("(", "").replace(")", "") : null;
    }
}