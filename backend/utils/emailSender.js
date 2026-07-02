const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const info = await transporter.sendMail({
      from: `" Solar EPC" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendInvoiceEmail = async (to, invoiceData, pdfPath) => {
  const html = `
    <h2>Invoice from  Solar EPC</h2>
    <p>Dear Client,</p>
    <p>Please find attached the invoice for your solar project.</p>
    <p><strong>Invoice Number:</strong> ${invoiceData.invoiceNumber}</p>
    <p><strong>Amount:</strong> ₹${invoiceData.totalInvoiceValue.toLocaleString('en-IN')}</p>
    <p><strong>Due Date:</strong> ${new Date(invoiceData.dueDate).toLocaleDateString('en-IN')}</p>
    <br>
    <p>Best regards,<br> Solar EPC Team</p>
  `;

  return await sendEmail(to, `Invoice ${invoiceData.invoiceNumber} -  Solar EPC`, html, [
    { filename: `Invoice-${invoiceData.invoiceNumber}.pdf`, path: pdfPath }
  ]);
};

module.exports = { sendEmail, sendInvoiceEmail };
