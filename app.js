const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const routes = require('./src/routes/index'); // Automatically picks index.js
const initSocket = require("./src/socket");
const cors = require("cors");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/", routes);       // Signup, login
app.use(cors({ origin: "*" })); // Or specific frontend URL
// Socket Server
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
