require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const materialRoutes = require("./routes/materialRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const disruptionRoutes = require("./routes/disruptionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

app.use("/api/materials", materialRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/disruptions", disruptionRoutes);
app.use("/api/analytics", analyticsRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.json({
    message: "SupplyGuard API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});