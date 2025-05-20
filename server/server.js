const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const db = require("./config/database.js");
const blogRoutes = require("./routes/blogRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const PORT = process.env.PORT || 4000;

// Connect to the database
db.dbConnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
  origin: '*',  // ✅ Removed trailing slash
  credentials: true,
}));

// Routes
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

// Root Route
app.get('/', (req, res) => {
  const title = "This is Backend Server of Blog Application website";
  res.send(`
    <html>
      <head>
        <title>Backend Server</title>
      </head>
      <body style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f9fa;">
        <h1 style="font-size: 36px; font-family: Arial, sans-serif; color: #333;">
          ${title}
        </h1>
      </body>
    </html>
  `);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`✅ Server Started Successfully at PORT ${PORT}`);
});
