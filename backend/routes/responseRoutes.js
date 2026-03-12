const express = require("express");
const router = express.Router();
const {
  submitResponse,
  getResponses,
  downloadCsv,
  getAnalytics,
} = require("../controllers/responseController");

router.post("/", submitResponse);
router.get("/:formId", getResponses);
router.get("/:formId/csv", downloadCsv);
router.get("/:formId/analytics", getAnalytics);

module.exports = router;
