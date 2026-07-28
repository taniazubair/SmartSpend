const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log("Sending email to:", to);
    console.log("Using sender:", process.env.BREVO_EMAIL);

    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "SmartSpend",
        email: process.env.BREVO_EMAIL,
      },

      to: [
        {
          email: to,
        },
      ],

      subject: subject,

      htmlContent: htmlContent,
    });

    console.log("Email sent successfully");
    return response;

  } catch (error) {
    console.error(
      "Email Error:",
      error.response?.body || error.message
    );

    throw error;
  }
};

module.exports = sendEmail;