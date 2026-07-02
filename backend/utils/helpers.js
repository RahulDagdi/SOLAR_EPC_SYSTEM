const formatIndianNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-IN');
};

const formatIndianDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const generateUniqueId = (prefix) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

const paginate = (array, page, limit) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    total: array.length,
    page,
    totalPages: Math.ceil(array.length / limit)
  };
};

module.exports = {
  formatIndianNumber,
  formatIndianDate,
  generateUniqueId,
  paginate
};
