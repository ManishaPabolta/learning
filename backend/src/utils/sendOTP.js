const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email Verification OTP",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
        ">
          <h2 style="color: #059669; margin-bottom: 20px;">
            Email Verification
          </h2>

          <p style="font-size: 16px; color: #374151;">
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

          <p style="font-size: 14px; color: #6b7280;">
            This OTP will expire in 5 minutes.
          </p>

          <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
            If you did not request this OTP, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("OTP Email Error:", error);
      throw new Error("Unable to send OTP email");
    }

    console.log("OTP Email Sent Successfully:", data?.id);

    return data;
  } catch (error) {
    console.error("OTP Email Error:", error);
    throw error;
  }
};

module.exports = sendOTP;