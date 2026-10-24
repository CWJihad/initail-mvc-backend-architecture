const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const LOGO_URL =
  "https://res.cloudinary.com/dfhfxt50d/image/upload/v1780554698/samples/cloudinary-icon.png";

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch((err) =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env",
      ),
    );
}

const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

const emailLayout = ({ preheader = "", title, subtitle, content }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="dark" />
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px; background-color:#16161d; border:1px solid #2a2a38; border-radius:16px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#16213e" style="background-color:#16213e; background-image:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%); padding:24px 32px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 12px;">
                <tr>
                  <td align="center" style="background-color:#ffffff; border-radius:12px; padding:6px;">
                    <img src="${LOGO_URL}" alt="Social-SaaS" width="48" style="display:block; width:48px; height:auto; border-radius:8px;" />
                  </td>
                </tr>
              </table>
              <h1 style="margin:0; font-size:22px; line-height:1.3; font-weight:700; color:#f0f0ff;">${title}</h1>
              <p style="margin:4px 0 0; font-size:13px; color:#8b8ba7;">${subtitle}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#111118; border-top:1px solid #1e1e2a; padding:14px 32px;">
              <p style="margin:0; font-size:11px; line-height:1.6; color:#6b6b85;">
                &copy; ${new Date().getFullYear()} Social-SaaS. All rights reserved.
                &nbsp;·&nbsp;
                <br/>
                <a href="https://jihad-protfolio.vercel.app/" target="_blank" style="color:#6b6b85; text-decoration:none;">
                ᯤ Develop by ᯤ
                <br/>
                Md Jihad Khan
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const sendEmailVerification = async (to, otp, name = "there") => {
  console.log("sendEmailVerification", to, otp, name);
  const subject = "User verification code";

  const html = emailLayout({
    preheader: `Your Social-SaaS verification code is ${otp}`,
    title: "Welcome to Social-SaaS",
    subtitle: "Verify your email to activate your account",
    content: `
      <p style="margin:0 0 8px; font-size:17px; font-weight:600; color:#e8e8f0;">Hi, ${name} 👋</p>
      <p style="margin:0; font-size:14px; line-height:1.6; color:#9090a8;">
        Thank you for joining Social-SaaS! Your account is almost ready. Enter the code below to verify your email.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:#1e1e2e; border:2px solid #6366f1; border-radius:12px;">
              <tr>
                <td align="center" style="padding:14px 36px;">
                  <div style="font-size:11px; color:#6666a0; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">Verification Code</div>
                  <div style="font-size:34px; font-weight:700; color:#a5b4fc; letter-spacing:6px; line-height:1.2;">${otp}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#1e1e2e; border:1px solid #2a2a3e; border-left:3px solid #6366f1; border-radius:8px; padding:12px 14px;">
            <p style="margin:0; font-size:12px; line-height:1.6; color:#8a8ab0;">
              <strong style="color:#c0c0e0;">⏱ Expires in 3 minutes.</strong>
              Never share this code with anyone. If you didn't create an account, ignore this email.
            </p>
          </td>
        </tr>
      </table>
    `,
  });

  await sendEmail(to, subject, html);
};

const sendResetPasswordEmail = async (to, otp, name = "there") => {
  console.log("Password Reset Email", to, otp);
  const subject = "Forgot Password Verification";

  const html = emailLayout({
    preheader: `Your Social-SaaS password reset code is ${otp}`,
    title: "Reset Your Password",
    subtitle: "Use the OTP below to reset your password",
    content: `
      <p style="margin:0 0 8px; font-size:17px; font-weight:600; color:#e8e8f0;">Hi, ${name} 👋</p>
      <p style="margin:0; font-size:14px; line-height:1.6; color:#9090a8;">
        We received a request to reset your password. Enter the code below to proceed.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:#1e1e2e; border:2px solid #6366f1; border-radius:12px;">
              <tr>
                <td align="center" style="padding:14px 36px;">
                  <div style="font-size:11px; color:#6666a0; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">Your OTP Code</div>
                  <div style="font-size:34px; font-weight:700; color:#a5b4fc; letter-spacing:6px; line-height:1.2;">${otp}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#1e1e2e; border:1px solid #2a2a3e; border-left:3px solid #6366f1; border-radius:8px; padding:12px 14px;">
            <p style="margin:0; font-size:12px; line-height:1.6; color:#8a8ab0;">
              <strong style="color:#c0c0e0;">⏱ Expires in 3 minutes.</strong>
              Never share this code with anyone. If you didn't request this, ignore this email — your password stays unchanged.
            </p>
          </td>
        </tr>
      </table>
    `,
  });

  await sendEmail(to, subject, html);
};

const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
};
