const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const users =require("./routes/api/users");
const cors = require('cors');
const app = express();
<<<<<<< HEAD
=======
const comptes=require("./routes/api/comptes");
>>>>>>> firstBranch

app.use(express.json());
const mongo_url = config.get("mongo_url");
app.use(cors())
mongoose.set('strictQuery',true);
mongoose 
<<<<<<< HEAD
    .connect(mongo_url, {useNewUrlParser : true , useUnifiedTopology : true})
    .then(() => console.log("mongdb connected..."))
    .catch((err) => console.log(err));
app.use("/api/users", users);
const port = process.env.PORT || 3001;
app.listen(port, ()=> console.log(`Server running on port $(port)`));
=======
    .connect(mongo_url)//    .connect(mongo_url, {useNewUrlParser : true , useUnifiedTopology : true})
    .then(() => console.log("mongdb connected..."))
    .catch((err) => console.log(err));
app.use("/api/users", users);
app.use("/api/comptes",comptes);  
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
>>>>>>> firstBranch
