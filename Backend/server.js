const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const users =require("./routes/api/users");
const cors = require('cors');
const app = express();

const comptes=require("./routes/api/comptes");
const patients=require("./routes/api/patients");
const assistants=require("./routes/api/assistants");
const RDV=require("./routes/api/Rendezvous");
const Consultation=require("./routes/api/consultations");
const Admin=require("./routes/api/Admin");
const Docteur=require("./routes/api/docteurs");
app.use(express.json());
const mongo_url = config.get("mongo_url");
app.use(cors())
mongoose.set('strictQuery',true);
mongoose.connect(mongo_url)//    .connect(mongo_url, {useNewUrlParser : true , useUnifiedTopology : true})
    .then(() => console.log("mongdb connected..."))
    .catch((err) => console.log(err));
app.use("/api/users", users);
app.use("/api/comptes",comptes);  
app.use("/api/patients",patients);
app.use("/api/assistants",assistants);
app.use("/api/RDV",RDV);
app.use("/api/Consultation",Consultation);
app.use("/api/admin",Admin);
app.use("/api/docteur",Docteur);
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

