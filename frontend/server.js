"use strict";

const express = require("express");
const fs = require("fs");

const app = express();
const SERVER = process.env.APP_SERVER;
const SERVER_PORT = process.env.APP_PORT;
const LISTEN_PORT = process.env.WEB_PORT;

if (!(SERVER && SERVER_PORT && LISTEN_PORT)) {
	console.log("unsatisfied environment variable");
	console.log("  BEND_SERVER", SERVER);
	console.log("  BEND_PORT", SERVER_PORT);
	console.log("  APP_PORT", LISTEN_PORT);
	process.exit(1);
}

let data = fs.readFileSync(`${__dirname}/state.js.def`, "utf-8");
data = data.replace("__SERVER__", `"${SERVER}"`).replace("__PORT__", SERVER_PORT);
fs.writeFileSync(`${__dirname}/scripts/state.js`, data);

app.use(express.static(`${__dirname}`));

app.get("/", (req, res) => {
	res.sendFile(`${__dirname}/app.html`);
});

app.listen(parseInt(LISTEN_PORT), () => {
	console.log(`server started on port ${LISTEN_PORT}`);
});
