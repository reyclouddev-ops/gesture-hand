const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        name: "ReyCloud AI Gesture",
        status: "Online",
        version: "1.0.0"
    });
});

app.listen(PORT, () => {
    console.clear();

    console.log("==================================");
    console.log("🤖 ReyCloud AI Gesture");
    console.log("==================================");
    console.log("Status : Online");
    console.log("Port   :", PORT);
    console.log("URL    : http://localhost:" + PORT);
    console.log("==================================");
});
