import { Message } from "discord.js";

import * as https from 'https';

import { DiscordPlugin } from '../src/Plugin';

export class Dadjoke extends DiscordPlugin {

    private reqOptions = {
        hostname: "icanhazdadjoke.com",
        path: "/",
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'Test Discord Bot'
        }
    }

    constructor() {
        super();
        this.setCommand("dad");
    }

    async xferMsg(cmd: Message, o: Array<string>) {
        let answer: any = await this.request(this.reqOptions);
        cmd.channel.send(answer.joke);
    }
}

module.exports = Dadjoke;