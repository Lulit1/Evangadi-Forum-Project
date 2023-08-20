require("dotenv").config();
const pool = require("./server/config/database");
const express = require("express");
const cors = require("cors");
const userRouter = require("./server/api/users/user.router");
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("api/users", userRouter);

app.listen(port, () => console.log(`listening at http://localhost: {port}`));
