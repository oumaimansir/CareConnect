const mongoose =require('mongoose');

//definir le schéma utilisateur
const CompteSchema=new mongoose.Schema({
nom:{
    type:String,
    required:true,
},
prenom:{
    type:String,
    required:true,
},
numtel:{
    type:Number,
    required:true,
},
email:{
type:String,
required:true,
unique:true,
},
password:{
    type:String,
    required:true,
},
adresse:{
    type:String,
   
},
datenaissance:{
    type:Date,
  
},
etat:{
    type:String,
  default:"active"
},
});

//créer un modèle basé sur ce schéma
const Compte=mongoose.model('Compte',CompteSchema);
module.exports=Compte;