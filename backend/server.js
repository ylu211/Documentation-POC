const mongoose = require("mongoose");
const app = require("./app");
const swaggerDocs = require("./swagger");

const PORT = 5001;
const MONGO_URL = "mongodb://mongo:27017/demo";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.log(err));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  swaggerDocs(app, PORT);
});

