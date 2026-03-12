const Form = require("../models/Form");
const Response = require("../models/Response");

// POST /api/responses — Submit a form response
exports.submitResponse = async (req, res, next) => {
  try {
    const { formId, answers } = req.body;
    if (!formId || !answers) {
      return res
        .status(400)
        .json({ message: "formId and answers are required" });
    }

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Validate required fields
    const errors = [];
    form.fields.forEach((field) => {
      if (field.required) {
        const answer = answers.find((a) => a.fieldId === field.fieldId);
        if (
          !answer ||
          answer.value === "" ||
          answer.value === null ||
          answer.value === undefined ||
          (Array.isArray(answer.value) && answer.value.length === 0)
        ) {
          errors.push(`"${field.label}" is required`);
        }
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const response = await Response.create({ formId, answers });
    res.status(201).json({ message: "Response submitted successfully", response });
  } catch (error) {
    next(error);
  }
};

// GET /api/responses/:formId — Get all responses for a form
exports.getResponses = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    const total = await Response.countDocuments({ formId });
    const responses = await Response.find({ formId })
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      responses,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/responses/:formId/csv — Download responses as CSV
exports.downloadCsv = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId).lean();
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const responses = await Response.find({ formId })
      .sort({ submittedAt: -1 })
      .lean();

    // Build CSV header from field labels
    const headers = [
      ...form.fields.map((f) => f.label),
      "Submitted At",
    ];

    // Build rows
    const rows = responses.map((r) => {
      const row = form.fields.map((f) => {
        const answer = r.answers.find((a) => a.fieldId === f.fieldId);
        if (!answer) return "";
        const val = Array.isArray(answer.value)
          ? answer.value.join("; ")
          : answer.value;
        // Escape CSV values
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      row.push(`"${new Date(r.submittedAt).toISOString()}"`);
      return row.join(",");
    });

    const csv = [headers.map((h) => `"${h}"`).join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${form.title.replace(/[^a-z0-9]/gi, "_")}_responses.csv"`
    );
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// GET /api/responses/:formId/analytics — Basic response analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId).lean();
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const totalResponses = await Response.countDocuments({ formId });
    const responses = await Response.find({ formId }).lean();

    // Build breakdowns for choice-type fields
    const choiceTypes = ["dropdown", "radio", "checkbox"];
    const fieldBreakdowns = form.fields
      .filter((f) => choiceTypes.includes(f.type))
      .map((field) => {
        const counts = {};
        field.options.forEach((opt) => {
          counts[opt] = 0;
        });

        responses.forEach((r) => {
          const answer = r.answers.find((a) => a.fieldId === field.fieldId);
          if (answer) {
            const values = Array.isArray(answer.value)
              ? answer.value
              : [answer.value];
            values.forEach((v) => {
              if (counts[v] !== undefined) {
                counts[v]++;
              }
            });
          }
        });

        return {
          fieldId: field.fieldId,
          label: field.label,
          type: field.type,
          counts,
        };
      });

    res.json({ totalResponses, fieldBreakdowns });
  } catch (error) {
    next(error);
  }
};
