
import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';

export async function sendEmail(to, subject, html) {

    const resolver = new dns.Resolver();
    resolver.setServers(['192.168.0.10']);

    const adresy = await resolver.resolve4('smtp.gmail.com');

    const transporter = nodemailer.createTransport({
        host: adresy[0],
        port: 465,
        secure: true,

        tls: {
            servername: 'smtp.gmail.com'
        },

        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: to,
        subject: subject,
        html: html
    });

}
