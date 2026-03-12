const express = require("express");
const router = express.Router();
const {
  submitResponse,
  getResponses,
  downloadCsv,
  getAnalytics,
} = require("https://dynamic-form-builder-0176.onrender.com/controllers/responseController");

router.post("https://dynamic-form-builder-0176.onrender.com/responses", submitResponse);
router.get("/:formId", getResponses);
router.get("/:formId/csv", downloadCsv);
router.get("/:formId/analytics", getAnalytics);

module.exports = router;
