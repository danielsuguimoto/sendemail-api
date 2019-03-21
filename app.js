const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'dist')));

var email = process.env.EMAIL;
var emailPassword = process.env.EMAIL_PASSWORD

app.post("/sendemail", (req, res) => {
    var transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: emailPassword
        }
    });

    var mailOptions = {
        from: req.body.email,
        replyTo: req.body.email,
        to: email,
        subject: "[FROM " + req.body.email + "] " + req.body.subject,
        text: req.body.name + " says: " + req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        var message = "";
        if (error) {
            message = "Error: " + error;
        }
        else {
            message = "Message sent successfully: " + info.response;
        }
        res.send(message);
    });
});

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
