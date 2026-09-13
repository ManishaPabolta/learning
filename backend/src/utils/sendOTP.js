const sendOTP = async (email, otp) => {
  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",

        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },

        body: JSON.stringify({
          sender: {
            name: "SkillForge",
            email: process.env.BREVO_SENDER_EMAIL,
          },

          to: [
            {
              email: email,
            },
          ],

          subject: "SkillForge Email Verification OTP",

          htmlContent: `
            <div style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 30px;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              background: #ffffff;
            ">

              <h2 style="
                color: #059669;
                margin-bottom: 20px;
              ">
                SkillForge Email Verification
              </h2>

              <p style="
                font-size: 16px;
                color: #374151;
              ">
                Your verification OTP is:
              </p>

              <div style="
                margin: 25px 0;
                padding: 20px;
                text-align: center;
                background: #ecfdf5;
                border-radius: 10px;
              ">

                <h1 style="
                  color: #047857;
                  font-size: 36px;
                  letter-spacing: 8px;
                  margin: 0;
                ">
                  ${otp}
                </h1>

              </div>

              <p style="
                font-size: 14px;
                color: #6b7280;
              ">
                This OTP will expire in 5 minutes.
              </p>

              <p style="
                font-size: 14px;
                color: #6b7280;
                margin-top: 25px;
              ">
                If you did not request this OTP,
                you can safely ignore this email.
              </p>

            </div>
          `,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo OTP Error:", data);

      throw new Error(
        data?.message || "Unable to send OTP email"
      );
    }

    console.log(
      "OTP Email Sent Successfully:",
      data?.messageId
    );

    return data;

  } catch (error) {
    console.error(
      "OTP Email Error:",
      error.message
    );

    throw error;
  }
};

module.exports = sendOTP;