const nodemailer = require('nodemailer');

const CONFIG = require('../constants');

const sendPasswordResetEmail = function (req, code) {
  const { email } = req.params;

  let transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: CONFIG.SENDGRID.api_key,
    },
  });

  let mailOptions = {
    from: CONFIG.COMPANY_INFO.app_emailaddress,
    to: email,
    subject: `${CONFIG.COMPANY_INFO.app_name} Account Recovery Code`,
    html: `<div style="width: 600px; margin: 0 auto">
              <h2>${CONFIG.COMPANY_INFO.app_name} account recovery</h2>
              <p>We received a request to reset your ${CONFIG.COMPANY_INFO.app_name} password. Enter the
                following password reset code:
              </p>
              <p style="padding: 20px 0;
                background-color: lightgray;
                width: 100px;
                text-align: center;
                border-style: solid;
                border-width: 1px"
              >
                ${code}
              </p>
              <p style="margin-top: 50px; font-weight: 900">Didn't request this change?<p>
              <p>If you didn't request a new password you may ingnore this email. The code will become invalid within 24 hours.</p>
              <div style="margin-top: 50px; opacity: 0.3; font-size: 12px; line-heigt: 12px">
                <hr />
                <p>This message was sent to ${email} at your request.</p><p>
                  ${CONFIG.COMPANY_INFO.company_name} & ${CONFIG.COMPANY_INFO.address}<p>
              </div>
            </div>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('30', error);
    }
  });
};

module.exports = sendPasswordResetEmail;
