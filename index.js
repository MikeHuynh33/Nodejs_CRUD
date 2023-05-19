// Import essential libraries 
const express = require('express'); 
const app = express(); 
const path = require('path'); 
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) =>{
    res.render("index", { title: "Home" });
})
app.get("/About" , (req, res) => {
    res.render("about"), { title: "About"};
})
app.get("/yujia", (req, res)=>{
    res.render("yujia", {title : "Yujia"} );
})
app.listen(process.env.port || 3000); 
console.log('Running at Port 3000'); 