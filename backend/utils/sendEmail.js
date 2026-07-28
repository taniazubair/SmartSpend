const Brevo = require("@getbrevo/brevo");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    apiInstance.authentications["apiKey"].apiKey =
      process.env.BREVO_API_KEY;

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "SmartSpend",
      email: process.env.BREVO_EMAIL,
    };

    sendSmtpEmail.to = [
      {
        email: to,
      },
    ];

    sendSmtpEmail.subject = subject;

    sendSmtpEmail.htmlContent = htmlContent;


    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log("Email sent successfully");

  } catch (error) {
    console.log(
      "Email Error:",
      error.response?.body || error.message
    );

    throw error;
  }
};


module.exports = sendEmail;