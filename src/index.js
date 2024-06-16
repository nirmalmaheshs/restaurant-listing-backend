require('dotenv').config();
const express = require("express");
const cors = require('cors'); // Import cors
const restaurantRoute = require("./routes/restaurant");
const connectDB = require("./db");

const port = process.env.PORT || 3000;
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to add CORS headers
app.use(cors())

connectDB();

app.use('/restaurant', restaurantRoute);

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});
