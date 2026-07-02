module.exports = (req, res, next) => {

    if (req.user.role === "super_admin") {
        req.organizationFilter = {};
    } else {
        req.organizationFilter = {
            organizationId: req.user.organizationId
        };
    }

    next();
};