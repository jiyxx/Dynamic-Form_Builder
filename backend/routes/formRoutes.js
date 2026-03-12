const express = require("express");
const router = express.Router();
const {
  createForm,
  getForms,
  getForm,
  updateForm,
  duplicateForm,
  deleteForm,
} = require("https://dynamic-form-builder-0176.onrender.com/controllers/formController");

router.post("/", createForm);
router.get("/", getForms);
router.get("/:id", getForm);
router.put("/:id", updateForm);
router.post("/:id/duplicate", duplicateForm);
router.delete("/:id", deleteForm);

module.exports = router;
