const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateGSTInvoice = async (invoiceData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('TAX INVOICE', { align: 'center' });
      doc.fontSize(12).text(' Solar EPC Pvt Ltd', { align: 'center' });
      doc.text('GSTIN: ' + (invoiceData.ourGSTIN || 'N/A'), { align: 'center' });
      doc.moveDown();

      // Invoice details
      doc.fontSize(10);
      doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`);
      doc.text(`Invoice Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}`);
      doc.text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString('en-IN')}`);
      doc.text(`Place of Supply: ${invoiceData.placeOfSupply}`);
      doc.moveDown();

      // Party details
      doc.text('Bill To:');
      doc.text(`Client GSTIN: ${invoiceData.clientGSTIN || 'N/A'}`);
      doc.moveDown();

      // Items table
      doc.text('Item Details:', { underline: true });
      doc.moveDown(0.5);

      let y = doc.y;
      doc.text('Description', 50, y);
      doc.text('HSN', 200, y);
      doc.text('Qty', 280, y);
      doc.text('Rate', 330, y);
      doc.text('Amount', 400, y);
      doc.text('GST', 480, y);
      doc.text('Total', 550, y);

      doc.moveDown();
      y = doc.y;

      invoiceData.items.forEach((item, idx) => {
        doc.text(item.description, 50, y + (idx * 20));
        doc.text(item.hsnCode, 200, y + (idx * 20));
        doc.text(`${item.quantity} ${item.unit}`, 280, y + (idx * 20));
        doc.text(item.ratePerUnit.toLocaleString('en-IN'), 330, y + (idx * 20));
        doc.text(item.taxableValue.toLocaleString('en-IN'), 400, y + (idx * 20));
        doc.text(item.gstAmount?.toLocaleString('en-IN') || '0', 480, y + (idx * 20));
        doc.text(item.totalAmount.toLocaleString('en-IN'), 550, y + (idx * 20));
      });

      doc.moveDown(2);

      // Totals
      doc.text(`Sub Total: ₹${invoiceData.subTotal.toLocaleString('en-IN')}`, { align: 'right' });
      doc.text(`CGST: ₹${invoiceData.totalCGST.toLocaleString('en-IN')}`, { align: 'right' });
      doc.text(`SGST: ₹${invoiceData.totalSGST.toLocaleString('en-IN')}`, { align: 'right' });
      doc.text(`IGST: ₹${invoiceData.totalIGST.toLocaleString('en-IN')}`, { align: 'right' });
      doc.fontSize(14).text(`Total: ₹${invoiceData.totalInvoiceValue.toLocaleString('en-IN')}`, { align: 'right' });

      doc.end();
      stream.on('finish', () => resolve(outputPath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateGSTInvoice };
