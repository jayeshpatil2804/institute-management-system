const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/errorMiddleware");
const compression = require('compression');
dotenv.config();
connectDB();

const app = express();

// Enable Gzip Compression (Must be first)
app.use(compression());

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const logger = require("./config/logger");

// Security Middleware
app.use(helmet());

// CORS Middleware (Must be before Rate Limiter for 429s to work in browser)
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173", "https://smartinstituteonline.com"].filter(Boolean),
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for dev/testing
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Logging
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());
// CORS was here - moved up

// Static Folder for Uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.get("/", (req, res) => res.send("API is running..."));
app.get("/api", (req, res) => res.send("API is running..."));
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/master/news', require('./routes/newsRoutes'));
app.use('/api/master/terms', require('./routes/termsRoutes'));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/master", require("./routes/masterRoutes"));
app.use("/api/transaction", require("./routes/transactionRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/user-rights", require("./routes/userRightRoutes"));
app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/transaction/attendance", require("./routes/attendanceRoutes"));
app.use("/api/branches", require("./routes/branchRoutes"));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
