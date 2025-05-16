import Handlebars from 'handlebars';
const source=`

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #1a73e8; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h2 style="margin: 0;">Verify Your Email Address</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; font-size: 16px; line-height: 1.6;">
                            <p>Hi {{name}},</p>
                            <p>Thank you for signing up with us! To complete your registration, please click the link below to verify your email address:</p>
                            <p style="text-align: center;">
                                <a href={{DOMAIN}}{{route}}/{{_id}} style="background-color: #4CAF50; color: white; padding: 10px 10px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">Verify Email Address</a>
                            </p>
                            <p>If you did not create an account, please ignore this email.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px; text-align: center; background-color: #f4f4f4; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="font-size: 14px; color: #666;">Best Regards,<br>Your Company Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>





`
const template = Handlebars.compile(source);

 const fileToSent= (data)=>{
    return template(data);
}
export default fileToSent;
   // <h1>Hello,{{name}}</h1>
     // <p>please verify your email by clicking the link below</p>
     // <a href={{DOMAIN}}{{route}}/{{_id}}>Verify Email</a>

//<h2>Verify Your Email Address</h2>
//<p>Hi {{name}},</p>
//<p>Thank you for signing up with us. To complete your registration, please click the link below to verify your email address:</p>
//<p><a href={{DOMAIN}}{{route}}/{{_id}}>Verify Email Address</a></p>
//<p>If you did not create an account, please ignore this email.</p>
//<br>
//<p>Best Regards,<br>Your Company Team</p>
