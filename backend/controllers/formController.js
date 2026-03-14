const Form = require("../models/Form");
const Response = require("../models/Response");


exports.createForm = async (req, res, next) => {
  try {
    const { title, description, fields, style, isPublished } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const form = await Form.create({
      title,
      description,
      fields,
      style,
      isPublished,
    });
    res.status(201).json(form);
  } catch (error) {
    next(error);
  }
};


exports.getForms = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || "";

    const query = search
      ? { title: { $regex: search, $options: "i" } }
      : {};

    const total = await Form.countDocuments(query);
    const forms = await Form.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    
    const formIds = forms.map((f) => f._id);
    const counts = await Response.aggregate([
      { $match: { formId: { $in: formIds } } },
      { $group: { _id: "$formId", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });
    const formsWithCounts = forms.map((f) => ({
      ...f,
      responseCount: countMap[f._id.toString()] || 0,
    }));

    res.json({
      forms: formsWithCounts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/forms/:id — Get a single form
exports.getForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    next(error);
  }
};


exports.updateForm = async (req, res, next) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    next(error);
  }
};


exports.duplicateForm = async (req, res, next) => {
  try {
    const original = await Form.findById(req.params.id).lean();
    if (!original) {
      return res.status(404).json({ message: "Form not found" });
    }
    const { _id, createdAt, updatedAt, ...rest } = original;
    const duplicate = await Form.create({
      ...rest,
      title: `Copy of ${original.title}`,
      isPublished: false,
    });
    res.status(201).json(duplicate);
  } catch (error) {
    next(error);
  }
};


exports.deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    await Response.deleteMany({ formId: req.params.id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
