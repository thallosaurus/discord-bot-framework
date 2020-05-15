import DiscordWebhook, { Webhook } from 'discord-webhook-ts';
//import { test } from './requests.js';

let test: Webhook.input.POST = {
    embeds: [
        {
            title: 'Some title',
            description: 'Some description',
        },
        {
            fields: [
                {
                    name: 'Some field',
                    value: 'Some field value',
                }
            ]
        }
    ]
}

class DiscordWebhookTest extends DiscordWebhook
{
    constructor()
    {
        super(process.env.API_TEST!);
        console.log("Set up");

        this.execute(test).then((response) => {
            console.log('Successfully sent webhook.')
        });

        debugger;        
    }
}

new DiscordWebhookTest();