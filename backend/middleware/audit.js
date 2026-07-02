const AuditLog = require('../models/AuditLog');

const auditLog = (action) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function(data) {
      if (req.user && res.statusCode < 400) {
        AuditLog.create({
          userId: req.user._id,
          userName: req.user.name,
          action: action,
          method: req.method,
          url: req.originalUrl,
          ipAddress: req.ip,
          referenceId: data?.data?._id || req.params.id,
          details: JSON.stringify(req.body),
          timestamp: new Date()
        }).catch(err => console.error('Audit log error:', err));
      }

      return originalJson(data);
    };

    next();
  };
};

module.exports = auditLog;
