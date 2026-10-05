module.exports = (req, res, next) => {
  const tenantId = req.headers["x-tenant-id"] || req.query.tenantId;

  if (!tenantId) {
    return res.status(400).json({
      success: false,
      message: "tenantId is required"
    });
  }

  req.tenantId = tenantId;
  next();
};
