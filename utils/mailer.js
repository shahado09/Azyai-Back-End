const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function sendVendorRequestToAdmin({
  userEmail,
  userName,
  instagram,
  vendorName,
  aboutVendor,
}) {
  const subject = `New Vendor Request - ${userName}`;

  const text = `
New Vendor Request Received

User Name: ${userName}
User Email: ${userEmail}
Instagram: ${instagram}
Vendor Name: ${vendorName}

About Vendor:
${aboutVendor}

Admin Panel:
${process.env.BASE_URL}/admin/vendor-requests
`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
  });
}


async function sendDecisionToUser(toEmail, userName, decision, adminNote) {
  let subject;
  let text;

  if (decision === "approved") {
    subject = "Your Vendor Request Has Been Approved 🎉";
    text = `
Hi ${userName},

Great news! Your vendor request has been approved.

You can now log in and start creating or managing your products.

Best regards,
Azyai Team
`;
  } else {
    subject = "Your Vendor Request Has Been Rejected";
    text = `
Hi ${userName},

Unfortunately, your vendor request has been rejected.

Admin Note:
${adminNote || "No note provided"}

You may submit a new request later.

Best regards,
Azyai Team
`;
  }

  await transporter.sendMail({ from: process.env.EMAIL_USER, to: toEmail, subject, text,});
}

module.exports = {sendVendorRequestToAdmin,sendDecisionToUser,};
