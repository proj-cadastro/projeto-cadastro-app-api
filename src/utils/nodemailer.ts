import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER, // exemplo: seuprojeto@gmail.com
        pass: process.env.MAIL_PASS  // senha de app do google
    }
});
