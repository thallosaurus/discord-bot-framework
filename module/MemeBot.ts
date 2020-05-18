import { Message } from "discord.js";

import * as querystring from 'querystring';

import { DiscordPlugin } from '../src/Plugin';

export class MemeBot extends DiscordPlugin {

    private GETOptions: object = {
        hostname: "api.imgflip.com",
        path: "/get_memes",
        method: 'GET'
    };

    private POSTOptions = {
        hostname: "api.imgflip.com",
        path: "/caption_image",
        method: "POST",
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    private lastUsedTemplate: string = "";

    constructor() {
        super();
        this.setCommand("meme");
        this.setDescription("Randomly selects a meme template and - if text is provided - writes the text onto the meme");
    }

    async xferMsg(cmd: Message, o: Array<string>) {
        let string = o.join(" ");
        let str_ = string.split(";");

        if (o.length > 0) {
            console.log("yay, args");
            let postData = querystring.stringify(
                {
                    template_id: this.lastUsedTemplate,
                    text0: str_[0],
                    text1: str_[1],
                    username: process.env.IMGFLIP_USER,
                    password: process.env.IMGFLIP_PW,
                    boxes: this.createBoxesArray(str_)
                }
            );

            console.log(postData);

            let answer: any = await this.request(this.POSTOptions, postData);

            cmd.channel.send(answer.data.url)
        }
        else {
            let answer: any = await this.request(this.GETOptions);
            let max = answer.data.memes.length;
            let rnd: number = Math.floor(Math.random() * Math.floor(max));
            this.lastUsedTemplate = answer.data.memes[rnd].id;
            cmd.channel.send(answer.data.memes[rnd].url);
        }
    }

    private createBoxesArray(a: string[]): any {
        let b = [];
        for (let i = 0; i < a.length; i++) {
            b.push(new Text(a[i]));
        }
        return b;
    }
}

class Text {
    public text: string = "";
    constructor(str: string) {
        this.text = str;
    }
}

//legacy compatibility:
module.exports = MemeBot;