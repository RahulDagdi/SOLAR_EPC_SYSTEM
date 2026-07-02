const calculateGST = (taxableValue, gstRate, isSameState = true) => {
  const gstAmount = (taxableValue * gstRate) / 100;

  if (isSameState) {
    return {
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      igst: 0,
      totalGST: gstAmount
    };
  } else {
    return {
      cgst: 0,
      sgst: 0,
      igst: gstAmount,
      totalGST: gstAmount
    };
  }
};

// GST rates for solar equipment
const GST_RATES = {
  'Solar Panels': 12,
  'Inverters': 18,
  'Cables': 18,
  'Mounting Structure': 12,
  'Civil Work': 12,
  'Electrical Work': 18,
  'BOS': 18,
  'Services': 18
};

module.exports = { calculateGST, GST_RATES };
