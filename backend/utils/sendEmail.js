const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    await brevo.transactionalEmails.sendTransacEmail({

      subject,

      htmlContent,

      sender: {
        name: "SmartSpend",
        email: process.env.BREVO_EMAIL,
      },

      to: [
        {
          email: to,
        },
      ],

    });

    console.log("Email sent successfully");

  } catch (error) {

    console.log(
      "Email Error:",
      error.message
    );

    throw error;
  }
};

module.exports = sendEmail;