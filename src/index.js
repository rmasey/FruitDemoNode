const Database = require("better-sqlite3");
const db = new Database("resources/Fruit.db");

// init project
var express = require("express");
var app = express();

const formProcessor = require("express-formidable");
app.use(formProcessor());

app.use(
  "/client",
  function (req, res, next) {
    console.log("Serving static content: " + req.path);
    next();
  },
  express.static("resources/client")
);

app.get("/list", function (req, res) {
  try {
    let ps = db.prepare(
      "SELECT Id AS 'id', Name AS 'name', Image AS 'image', Colour AS 'colour', Size AS 'size' FROM Fruits"
    );
    let results = ps.all();
    res.json(results);
  } catch (error) {
    console.log("ERROR: " + error);
    res.json({ error: "Unable to list fruits" });
  }
});

app.post("/delete", function (req, res) {
  console.log("invoked delete");
  console.log(req.fields["id"]); //empty?  why is this
  try {
    let ps = db.prepare("DELETE FROM Fruits WHERE Id = ?");
    // use .run on statements that don't return any data
    // when execution completes it returns info object describing
    // any changes made.
    // info.changes is the total number of rows inserted, updated
    // or deleted by this operation
    // if the statement fails an Error is thrown

    let info = ps.run(req.fields["id"]);
    if (info.changes === 1) {
      res.json({ status: "OK" });
    } else {
      res.json({ status: "not good " });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
});

app.post("/insert", function (req, res) {
  console.log("invoked add");
  console.log(req.fields);
  try {
    let ps = db.prepare(
      "INSERT INTO Fruits (Name, Image, Colour, Size) VALUES (?, ?, ?, ?)"
    );
    let info = ps.run(
      req.fields["name"],
      req.fields["image"],
      req.fields["colour"],
      req.fields["size"]
    );
    if (info.changes === 1) {
      res.json({ status: "OK" });
    } else {
      res.json({ status: "not good " });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
});

app.post("/update", function (req, res) {
  console.log("invoked update");
  console.log(req.fields);
  try {
    let ps = db.prepare(
      "UPDATE Fruits SET Name = ?, Image = ?, Colour = ?, Size = ? WHERE Id = ?"
    );
    let info = ps.run(
      req.fields["name"],
      req.fields["image"],
      req.fields["colour"],
      req.fields["size"],
      req.fields["id"]
    );
    if (info.changes === 1) {
      res.json({ status: "OK" });
    } else {
      res.json({ status: "not good " });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
});

app.get("/get/:id", function (req, res) {
  console.log("invoked /get/:id");
  console.log(req.params.id);
  try {
    let ps = db.prepare(
      "SELECT Name AS 'name', Image AS 'image', Colour AS 'colour', Size AS 'size' FROM Fruits WHERE Id = ?"
    );
    let results = ps.all(req.params.id);
    res.json(results);
  } catch (error) {
    console.log("ERROR: " + error);
    res.json({ error: error });
  }
});

// Listen on port 8080
var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
