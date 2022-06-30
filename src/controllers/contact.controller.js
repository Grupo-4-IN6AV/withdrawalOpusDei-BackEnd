'use strict'

//Constantes para Contactanos
const nodeMailer = require('nodemailer')
const { google, Auth } = require('googleapis')

exports.sendMessage = async (req, res) => {
    try {
        const params = req.body;
        let contentHTML = `
            <h1>Información de Usuario</h1>
            <ul>
                <li>Nombre: ${params.username} </li>
                <li>Correo Electronico: ${params.email} </li>
                <li>Telefono: ${params.phone} </li>
            </ul>
            <h1>Mensaje</h1>
            <p>Mensaje: ${params.message}</P>
        `;

        const CLIENTID = "414889736045-3jtc6cjnrcgoa8gmp0rh15vv6ke64ohf.apps.googleusercontent.com";
        const CLIENT_SECRET = "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";
        const REDIRECT_URI = "https://developers.google.com/oauthplayground";
        const REFRESH_TOKEN = "1//04p4RsSgpJYViCgYIARAAGAQSNwF-L9Ir2cqGPz7SKYF6Ysfk3HVfXNKQE-ZiL3bm4-1W7WvI7Xu9T9vb4491o1wqgSrgXxtcXkg";

        const oAuth2Client = new google.auth.OAuth2(CLIENTID, CLIENT_SECRET, REDIRECT_URI);

        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        async function sendMail() {
            try {
                const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
                const transporte = nodeMailer.createTransport({
                    service: "gmail",
                    auth: {
                        type: "OAuth2",
                        user: "opusdeitechnicalservice@gmail.com",
                        clientId: CLIENTID,
                        clientSecret: CLIENT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: ACCESS_TOKEN
                    }
                });
                const mailOptions = {
                    from: "Opus Dei <opusdeitechnicalservice@gmail.com>",
                    to: "opusdeitechnicalservice@gmail.com",
                    subject: "Mensaje de Contactanos",
                    html: contentHTML
                };

                const result = await transporte.sendMail(mailOptions);
                return result;
            } catch (err) {
                console.log(err)
            }
        }

        sendMail()
            .then((result) => {
                return res.send({ message: 'Mensaje enviado Existosamente' });
            })
            .catch((err) => {
                return res.status(400).send({ message: 'Error = ' + err.message });
            })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error enviando mensaje' });
    }
}