import { Message } from "discord.js";

import * as querystring from 'querystring';

import { DiscordPlugin, Argument } from '../src/Plugin';

import * as fs from "fs";

import memes from '../src/memes.json';

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

    //Popular Meme Templates @ ImgFlip: https://api.imgflip.com/popular_meme_ids

    private lastUsedTemplate: string = "8072285";

    private popularMemeIds:PopularMemeIds = new PopularMemeIds();

    constructor() {
        super();
        this.setCommand("meme");
        this.setDescription("creates a meme with provided text. Use !meme (TEMPLATE) upper text;lower text");
    }

    //old
    async xferMsgOld(cmd: Message, o: Argument) {
        //let string = o.args.join(" ");
        //let str_ = o.args!.split(";");
        cmd.channel.startTyping();

        if (o.args!.length > 0) {
            let postData = querystring.stringify(
                {
                    template_id: this.lastUsedTemplate,
                    text0: o.args![0] || "",
                    text1: o.args![1] || "",
                    username: process.env.IMGFLIP_USER,
                    password: process.env.IMGFLIP_PW
                }
            );

            console.log(postData);

            let answer: any = await this.request(this.POSTOptions, postData);

            cmd.channel.send(answer.data.url);
        }
        else
        {
            cmd.channel.send("No meme template selected.");
        }
        cmd.channel.stopTyping();
    }

    //new
    async xferMsg(cmd: Message, o: Argument) {

        if (o.sub != null)
        {
            let box = this.createBoxesArray(o.args);

            let template = this.getTemplate(o);
            console.log(template);

            let postData = {
                template_id: template,
                username: process.env.IMGFLIP_USER,
                password: process.env.IMGFLIP_PW,
            };

            Object.assign(postData, this.extractText(o.args));

            console.log(JSON.stringify(postData));

            let answer: any = await this.request(this.POSTOptions, querystring.stringify(postData));
            if (answer.success)
            {
                cmd.channel.send(answer.data.url);
            }
            else
            {
                cmd.channel.send(answer.error_message);
            }
        }
        else
        {
            cmd.channel.send("Available Templates:");
            cmd.channel.send(this.popularMemeIds.help());
        }
    }

    private extractText(args:string[] | null)
    {
        console.log(args);
        return {
            text0: args != null ? args![0] : " ",
            text1: args != null && args![1] ? args![1] : " "
        }
    }

    private getTemplate(o:Argument)
    {
        return o.sub != null ? this.popularMemeIds.search(o.sub) : this.popularMemeIds.getRandomMeme();
    }

    private createBoxesArray(a: string[] | null): any {
        let b = [];
        console.log(a);
        if (a != null)
        {
            for (let i = 0; i < a.length; i++) {
                b.push(new Text(a[i]));
            }
        }
        else
        {
            b.push(new Text(""));
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

class PopularMemeIds
{
    private memes:any;

    constructor()
    {
        console.log(memes);
        this.memes = memes;
    }

    search(query:string) {

        for (var key in this.memes) {
            var value = this.memes[key];
    
            if (value.includes(query.toLocaleLowerCase()))
            {
                return <string>key;
            }
        }
        return this.getRandomMeme();
    }

    getRandomMeme()
    {
        let keys = Object.keys(this.memes);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    help()
    {
        let b = " ";
        for (let i in this.memes)
        {
            b += this.memes[i][0] + " - ";

        }
        return b;
    }
}