const express = require("express");
const radDataRoute = require("./routes/radDataRoute");

const app = express();
const port = 3000;

app.use("/radData/", radDataRoute);

app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).send("it brokey");
})

app.get("/", (req, res) => {
    res.set('Content-Type', 'application/json');
    res.status(404).json({ data: "There's nothing here :(" });
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});


