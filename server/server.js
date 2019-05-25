const express = require("express");
const cors = require("cors");
const historical = require("./historical/historical.router");
const app = express();

app.use(cors());
app.use(express.static("dist"));


app.use("/historical", historical);

app.listen(3000);
