
const nodemailer = require("nodemailer");

const sendEmail = async (options)=>{
    // create reusable transporter object using the default SMTP transport

    let transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "881abf84fbf4ea",
            pass: "a536cf30ca742e"
        }
    });

    //DEFINE THE EMAIL OPTİONS
    const mailOptions = {
        from: '"HAKAN YAMAN 👻" <yaman@inveon.com>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        html: options.message, // html body
    }

    // send mail with defined transport object
    let info =await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
export default sendEmail;