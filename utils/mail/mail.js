
import nodemailer from "nodemailer";
import fileToSent from "../../templates/emailTemplate.js";



const sendEmail = async (name,email,_id,emailType) => {
 

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user:process.env.EMAIL_USER, // your email address to send email from
        pass: process.env.EMAIL_PASS, // your gmail account password
      },
    });

    // Render the template with the data
   // console.log(_id,process.env.DOMAIN,emailType);
    //console.log(`${process.env.DOMAIN}/${emailType}/${_id}`);
    
    const htmlToSend = fileToSent({name,_id,DOMAIN:process.env.DOMAIN,route:emailType});
    


    const mailOptions = {
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: emailType==="verification"?"verification":"reset-password", // Subject line
      html: htmlToSend, // HTML body
    };

    // Send the email
    const info = new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
        }
        resolve(info);
      });
    });

    
    return await info;
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error("Error sending email:", error);
    //     throw new Error(error);
    //   }
    //   console.log("Email sent successfully:", info.response);
    //   return info;
    // });
  } catch (error) {
    console.log(error + "  error in sending email");
    throw new Error(error);
  }
};

export default sendEmail;
