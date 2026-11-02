export function validateEvent(req, res, next) {
  const { title, category, date, location, volunteersNeeded, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    return res.status(400).json({
      error: 'Event title is required and must be at least 5 characters.',
    });
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({
      error: 'Valid event category is required.',
    });
  }

  if (!date) {
    return res.status(400).json({
      error: 'Event date is required.',
    });
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime()) || selectedDate <= today) {
    return res.status(400).json({
      error: 'Event date must strictly be a future date (tomorrow or later).',
    });
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    return res.status(400).json({
      error: 'Specific meeting location or distribution address is required.',
    });
  }

  const quota = Number(volunteersNeeded);
  if (!quota || quota < 1 || isNaN(quota)) {
    return res.status(400).json({
      error: 'Target volunteer quota must be a positive number of at least 1.',
    });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({
      error: 'Event description must provide at least 10 characters of logistical instructions.',
    });
  }

  next();
}
