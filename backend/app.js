const express = require("express");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//Route imports
const blog = require("./routes/blogRoute");
const user = require("./routes/userRoute");
const comment = require("./routes/commentRoute");
const like = require("./routes/likeRoute");

app.use("/api",blog);
app.use("/api",user);
app.use("/api",comment);
app.use("/api",like);

//middleware for error
app.use(errorMiddleware);

module.exports = app;