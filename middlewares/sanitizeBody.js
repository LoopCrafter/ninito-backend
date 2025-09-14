export const sanitizeBody = (allowedFields = []) => {
  return (req, res, next) => {
    const updates = {};
    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    req.body = updates;
    next();
  };
};
