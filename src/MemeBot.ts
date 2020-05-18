import { Message } from "discord.js";

import * as https from 'https';

export class MemeBot
{
    public command:string = "meme";

    private GETOptions:object = {
        "method": 'GET'
    };

    private POSTOptions:object = {};

    private lastUsedTemplate:string = "";

    constructor()
    {
        console.log("Hello World");
    }

    async xferMsg(cmd:Message, o:Array<string>)
    {

        console.log("Meme bot");
        let string = o.join(" ");
        let str_ = string.split("//");

        if (o.length != 0)
        {
            //!meme "top caption"
            let request = {

            }
        }
        else
        {
            let answer:any = await this.getRequest("https://api.imgflip.com/get_memes", this.GETOptions);
            let max = answer.data.memes.length;
            let rnd:number = Math.floor(Math.random() * Math.floor(max));
            this.lastUsedTemplate = answer.data.memes[rnd].id;
            cmd.channel.send(answer.data.memes[rnd].url);
        }
    }

    async getRequest(url:string, options:any)
    {
        return new Promise((resolve, reject) => {
            let req = https.get(url, options, res => 
            {
                res.setEncoding("utf8");
    
                let body = "";
                res.on("data", data => {
                    body += data;
                });
    
                res.on("end", () => {
                    resolve(JSON.parse(body));
                });

                res.on("error", (e) => {
                    reject(e);
                });
            });
            req.end();
        });
    }

    async postRequest(url:string, options:any)
    {
        return new Promise((resolve, reject) => {
            https.request(url, options, res => 
            {
                res.setEncoding("utf8");
    
                let body = "";
                res.on("data", data => {
                    body += data;
                });
    
                res.on("end", () => {
                    resolve(JSON.parse(body));
                });

                res.on("error", (e) => {
                    reject(e);
                });
            });
        });
    }
}