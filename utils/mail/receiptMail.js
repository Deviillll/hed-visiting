import nodemailer from 'nodemailer';


// This function sends an email with the receipt PDF attached
const sendReceiptEmail = async (appointment, filePath) => {
  try {
    // Create a transporter using your Gmail credentials (or any SMTP service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Or another service if you're using something else
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,  // Your email address (sender)
        pass: process.env.EMAIL_PASS,  // Your email app password or regular password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL,  // Sender email
      to: appointment.email,  // Receiver email (from appointment)
      subject: 'Your Appointment Receipt',
      text: `Dear ${appointment.name},\n\nThank you for your appointment. Please find attached the receipt for your booking.\n\nBest regards,\nYour Company Name`,
      attachments: [
        {
          filename: `receipt_${appointment._id}.pdf`,  // Name of the PDF file
          path: filePath,  // Path to the generated PDF file
        },
      ],
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);

    // Return success response
    return {
      message: 'Receipt generated and sent to email successfully',
      filePath,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

export default sendReceiptEmail;
