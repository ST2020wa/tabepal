// middleware/itemValidation.js
const validateItem = (req, res, next) => {
    const { name, quantity, expiredDate, tag } = req.body;
    
    // Name validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Valid name is required' });
    }
    
    // Quantity validation
    if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }
    
    // Expiry date validation
    if (expiredDate) {
      const date = new Date(expiredDate);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Invalid expiry date format' });
      }
    }
    
    // Tag validation (optional)
    if (tag !== undefined && (typeof tag !== 'string' || tag.trim().length === 0)) {
      return res.status(400).json({ error: 'Tag must be a non-empty string' });
    }
    
    next();
  };

export { validateItem };