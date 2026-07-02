const PaymentTerms = require("../../models/masters/PaymentTerms");

const base = require("./baseMaster.controller");

exports.getPaymentTerms = base.getAll(PaymentTerms);

exports.getPaymentTerm = base.getById(PaymentTerms);

exports.createPaymentTerm = base.create(PaymentTerms);

exports.updatePaymentTerm = base.update(PaymentTerms);

exports.deletePaymentTerm = base.remove(PaymentTerms);
