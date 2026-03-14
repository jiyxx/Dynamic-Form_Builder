const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());


app.use("https://dynamic-form-builder-0176.onrender.com/api/forms", require("./routes/formRoutes"));
app.use("https://dynamic-form-builder-0176.onrender.com/api/responses", require("./routes/responseRoutes"));


app.get("https://dynamic-form-builder-0176.onrender.com/health", (req, res) => {
  res.json({ message: "FormForge API is running" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
