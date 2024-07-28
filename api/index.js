

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const bidRoutes = require("./routes/bidRoutes");
const path = require("path");

//install swagger api documentation
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// Other imports...

require("./controllers/cronController"); // This will start the cron job

// Other app configurations...

dotenv.config();
const app = express();
// app.use(cors());
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URL);

app.use("/api/users", userRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auction API",
      version: "1.0.0",
      description: "An API for auctions",
      contact: {
        name: "Auction API",
        url: "http://localhost:5317",
        email: "agrawalom711@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};

const spacs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spacs));

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
