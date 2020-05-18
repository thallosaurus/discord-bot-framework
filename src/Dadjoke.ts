import { Message } from "discord.js";

import * as https from 'https';

export class Dadjoke
{
    public command:string = "dad";

    private options:object;

    private link:string = "https://icanhazdadjoke.com/";

    constructor()
    {
        console.log("Dad jokes are mad jokes \\m/");
        this.options = {
            method: 'get',
            headers: {'Accept': 'application/json',
            'User-Agent': 'Test Discord Bot'}
        }
    }

    async xferMsg(cmd:Message, o:Array<string>)
    {
        let answer:any = await this.makeRequest(this.link)
        .catch((e) => {
            console.log(e);
        });
        cmd.channel.send(answer.joke);
    }

    async makeRequest(url:string)
    {
        return new Promise((resolve, reject) => {
            https.get(url, this.options, res => 
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