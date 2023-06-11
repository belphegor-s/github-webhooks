import { Request, Response } from "express";
import webhooks from "../data/webhooks.json";
import { webhooks as webhooksType } from "../types/webhooks";
import fs from "fs";
import path from "path";
import axios from "axios";

const webHooksData : webhooksType = webhooks;

const webHookController = (req: Request, res: Response) => {
    let success = false, msg = '';

    const payloadURL = (req.body?.payloadURL && typeof req.body?.payloadURL === 'string' && req.body?.payloadURL !== '' && req.body?.payloadURL) || '',
    secret = (req.body?.secret && typeof req.body?.secret === 'string' && req.body?.secret !== '' && req.body?.secret) || '',
    eventTypes = (req.body?.eventTypes && Array.isArray(req.body?.eventTypes) && req.body?.eventTypes?.length !== 0 && req.body?.eventTypes) || [];

    if(!payloadURL) {
        msg = 'Invalid Payload URL';
        return res.status(422).json({ success, msg});
    } else if(!secret) {
        msg = 'Invalid Secret';
        return res.status(422).json({ success, msg});
    } else if(!eventTypes) {
        msg = 'Invalid Events';
        return res.status(422).json({ success, msg});
    }

    eventTypes.forEach((eventType: string) => {
        webHooksData[eventType as keyof webhooksType].push({payloadURL, secret})
    })

    fs.writeFileSync(path.join(__dirname, '../data/webhooks.json'), JSON.stringify(webHooksData, null, 4)); // writing to JSON file

    success = true;
    msg = 'Webhook Resource Created';
    res.status(201).json({success, msg});
}

const eventEmulate = (req: Request, res: Response) => {
    let success = false, msg = '';
    const type = (req.body?.type && typeof req.body?.type === 'string' && req.body?.type !== '' && req.body?.type) || '',
    data = (req.body?.data && typeof req.body?.data === 'object' && req.body?.data) || {};
    
    if(!type) {
        msg = 'Type is Invalid!';
        return res.status(422).json({success, msg});
    } else if(!data) {
        msg = 'Data is Invalid!';
        return res.status(422).json({success, msg});
    }

    // Business Logic

    // Event Trigger (Webhook Call)
    setTimeout(async () => {
        const webhookList = webHooksData[type as keyof webhooksType];
        for(let i=0;i<webhookList.length;i++) {
            const webhook = webhookList[i];
            const { payloadURL, secret } = webhook;
            try {
                await axios.post(payloadURL, data, {
                    headers: {
                        'x-secret': secret
                    }
                })
            } catch(e) {
                console.log(`Error making request to payload -> ${e}`);
            }
        }
    }, 0)

    success = true;
    msg = 'Successfully emulated event';
    res.status(200).json({success, msg});
}

const getWebhooks = (req: Request, res: Response) => {
    res.status(200).json(webhooks)
}

export { webHookController, eventEmulate, getWebhooks }