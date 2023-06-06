const express = require("express");
const app = express();
const env = require("./env");
const WEBPATH = "./templates";
const fs = require("fs");
const http = require("http");

const route_test = require(env.test_router_path)(app);

app.use(express.static(__dirname + "/static"));


//require('dotenv').config();
//process.env.PORT

app.get("/main", (req, res) => {
	fs.readFile(`${WEBPATH}/main.html`, (error, data) => {
		if (error) {
			console.log(error);
			return res.status(500).send("<h1>500 Error</h1>");
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
		});
	//res.send("hello")
});
app.get("/map", (req, res) => {
	fs.readFile(`${WEBPATH}/map.html`, (error, data) => {
		if (error) {
			console.log(error);
			return res.status(500).send("<h1>500 Error</h1>");
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
		});
	//res.send("hello")
});
app.get("/calendar", (req, res) => {
	fs.readFile(`${WEBPATH}/calendar.html`, (error, data) => {
		if (error) {
			console.log(error);
			return res.status(500).send("<h1>500 Error</h1>");
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
		});
	//res.send("hello")
});
app.get("/test", (req, res) => {
	fs.readFile(`${WEBPATH}/test.html`, (error, data) => {
		if (error) {
			console.log(error);
			return res.status(500).send("<h1>500 Error</h1>");
		}
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(data);
		});
	//res.send("hello")
});


app.listen(env.port, ()=>{
	console.log(env.port)
});
