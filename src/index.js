require('dotenv').config();
const express = require("express");
const cors = require('cors'); // Import cors
const restaurantRoute = require("src/routes/restaurant");
const authRoute = require("src/routes/auth");
const errorHandler = require('src/middleware/errorHandler');
const connectDB = require("src/db");

const port = process.env.PORT || 3000;
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to add CORS headers
app.use(cors());

connectDB();

app.use('/restaurant', restaurantRoute);
app.use('/auth', authRoute);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
