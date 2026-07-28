const Brevo = require("@getbrevo/brevo");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const email = new Brevo.SendSmtpEmail();

    email.sender = {
      name: "SmartSpend",
      email: process.env.BREVO_EMAIL,
    };

    email.to = [
      {
        email: to,
      },
    ];

    email.subject = subject;
    email.htmlContent = htmlContent;

    await apiInstance.sendTransacEmail(email);

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