const express = require("express");
const cors = require("cors");

const getDate = (time) => {
  if (time == null) {
    return new Date();
  }
  const date = Number.isInteger(+time) ? new Date(+time) : new Date(time);
  return date == "Invalid Date" ||
    date.toISOString().slice(0, 10) === time ||
    date.valueOf() === +time
    ? date
    : new Date("Invalid Date");
};

const app = express()
  .use(cors({ optionSuccessStatus: 200 })) // some legacy browsers choke on 204
  .use(express.static("public")) // http://expressjs.com/en/starter/static-files.html
  .get("/api/timestamp/:time", (req, res) => {
    const date = getDate(req.params.time);
    const isInvalid = date == "Invalid Date";
    res.json({
      unix: isInvalid ? null : date.getTime(),
      utc: isInvalid ? date.toString() : date.toUTCString(),
    });
  })
  .get("/api/timestamp", (_, res) => {
    const date = new Date();
    return res.json({ unix: date.valueOf(), utc: date.toUTCString() });
  })
  .get("/", (_, res) => res.sendFile(__dirname + "/views/index.html"));

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
  console.log(`http://localhost:${listener.address().port}`);
});
