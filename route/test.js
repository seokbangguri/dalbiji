module.exports = (app) => {
	const router = require("express").Router();
	app.get("/i", (req, res) => {
		console.log("test")
		res.send("hello world");	
	});
	return router;
}
