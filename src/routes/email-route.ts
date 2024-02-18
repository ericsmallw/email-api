import {Router} from 'express';
import nodemailer from 'nodemailer';

import EmailRequest from '../models/email-request';

const router = Router();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string),
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

router.post('/', (req, res) => {
    const emailRequest: EmailRequest = req.body;

    if(!emailRequest.to || !emailRequest.subject || !emailRequest.body) {
        res.status(400).send('Invalid request');
        return;
    }

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: emailRequest.to,
        subject: emailRequest.subject,
        text: emailRequest.body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error)
            res.status(500).send('Internal server error');
        } else {
            console.log('success!');
            res.status(200).send('Email Sent!');
        }
    });
});

module.exports = router;