import { Message } from "discord.js";

import * as https from 'https';

import { DiscordPlugin, Argument } from '../src/Plugin';

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
        this.setDescription("Returns a mad dad joke! Be prepared");
    }

    async xferMsg(cmd: Message, o: Argument) {
        let answer: any = await this.request(this.reqOptions);
        cmd.channel.send(answer.joke);
    }
}

module.exports = Dadjoke;