require("dotenv").config();
const fetchData = require("./utils/fetchData");
const getData = require("./utils/getData");

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(res => {
    app.listen(3000, () => console.log("Server ready!"));
})
.catch(err => {
    console.log(err);
});

app.use(async (req, res) => {
   try {
       let data = req.path.split("/");
       if(data[0] === "") data.shift();
       if(data[data.length-1] === "") data.pop();

       let hatKodu = data[0];
       data.shift();

       let hat = await getData(hatKodu);

       data.forEach(item => {
           hat = hat[item];
       });
       
       if(typeof hat !== "object" || hat.length){
           let hat2 = {};
           hat2[data[data.length-1]] = hat;

           return res.json(hat2);
       };

       return res.json(hat);
   } catch {
       return res.json({ status: 500, message: "Bir hata oluştu!" });
   }
});