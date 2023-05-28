// Import essential libraries
const express = require("express");
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

//CONVER FORM TO JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Mongo DB connecting
const { MongoClient, ObjectId } = require("mongodb");
const lab3_url = "mongodb://localhost:27017/lab3";
const client = new MongoClient(lab3_url);
async function connection() {
  db = client.db("lab3");
  return db;
}
async function getOneEmployee(empId) {
  db = await connection();
  let employee_detail;
  const employee_id = new ObjectId(empId);
  try {
    employee_detail = db.collection("lab3-employee").findOne({
      _id: employee_id,
    });
  } catch (error) {
    return error;
  }
  return employee_detail;
}
async function getAllEmployee() {
  db = await connection();
  let result = db.collection("lab3-employee").find({});
  let res = await result.toArray();
  return res;
}
async function DeleteEmployee(emp_id) {
  db = await connection();
  const employee_id = new ObjectId(emp_id);
  try {
    db.collection("lab3-employee").deleteOne({
      _id: employee_id,
    });
  } catch (error) {
    return error;
  }
  return "Successful";
}
async function addNewEmployee(employee) {
  db = await connection();
  try {
    db.collection("lab3-employee").insertOne(employee);
  } catch (error) {
    return error;
  }
  return "Successful";
}

async function EditEmployee(myquery, newvalue) {
  db = await connection();
  try {
    db.collection("lab3-employee").updateOne(myquery, newvalue);
  } catch (error) {
    return error;
  }
  return "Successful";
}
// Pages Rendering
app.get("/", async (req, res) => {
  let employee = await getAllEmployee();
  res.render("index", { title: "Home", employee: employee });
});
app.get("/Add", (req, res) => {
  res.render("Add", { title: "Add" });
});

app.get("/Edit", async (req, res) => {
  let oneEmployee = await getOneEmployee(req.query.empId);
  res.render("Edit", { title: "Edit", oneEmployee: oneEmployee });
});

// Delete - GET
app.get("/Delete", async (req, res) => {
  await DeleteEmployee(req.query.empId);
  res.redirect("/");
});
// ADD - POST
app.post("/Add/NewEmployee", async (req, res) => {
  if (req.body.fName || req.body.lName) {
    //rewrite Json to ensure it being formatted correctly.
    let rewirteJson = {
      fname: req.body.fName,
      lname: req.body.lName,
    };
    let errorhandler = await addNewEmployee(rewirteJson);
    if (errorhandler == "Successful") res.redirect("/");
    else res.render("Add", { error: errorhandler.errorMessage });
  } else {
    res.render("Add", { error: "Dont leave it empty" });
  }
});
// EDIT - POST
app.post("/Edit/Comfirmed", async (req, res) => {
  if (req.body.fName || req.body.lName) {
    const id = new ObjectId(req.body.id);
    //rewrite Json to ensure it being formatted correctly.
    let myquery = {
      _id: id,
    };
    let newvalue = {
      $set: {
        fname: req.body.fName,
        lname: req.body.lName,
      },
    };
    let errorhandler = await EditEmployee(myquery, newvalue);
    if (errorhandler == "Successful") res.redirect("/");
    else res.render("Add", { error: errorhandler.errorMessage });
  } else {
    res.render("Edit", { error: "Dont leave it empty" });
  }
});
app.listen(process.env.port || 3000);
console.log("Running at Port 3000");
