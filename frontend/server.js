"use strict";

const express = require("express");

const app = express();

app.use(express.static(`${__dirname}`));

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/app.html`);
});

app.listen(3000, () => {
	console.log("server started on port 3000");
});
