const router=require("express").Router();
const bcrypt=require("bcryptjs");
const config=require("config");
const jwt=require("jsonwebtoken");
const Assistant=require("../../models/Assistant");

router.post("/registerAssistant", async (req, res) => {
    try {
        const { nom, prenom, numtel, email, password, adresse, datenaissance, role } = req.body;
        console.log("Received data:", req.body);

        if (!nom || !prenom || !numtel || !email || !password || !role) {
            console.log("Missing required fields");
            return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
        }

        // Vérification si l'email existe déjà
        const existingAssistant = await Assistant.findOne({ email });
        if (existingAssistant) {
            console.log("Email already exists");
            return res.status(400).send({ status: "notokemail", msg: "Email already exists" });
        }

        // Créer une nouvelle instance de Patient
        const newAssistant = new Assistant({
            nom,
            prenom,
            numtel,
            email,
            password,
            adresse,
            datenaissance,
            role,
        });

        console.log("New account object:", newAssistant);

        // Générer le salt et hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        newAssistant.password = await bcrypt.hash(newAssistant.password, salt);

        // Sauvegarder le patient dans la base de données
        const savedAssistant = await newAssistant.save();
        console.log("Account saved successfully:", savedAssistant);

        // Générer un token JWT
        const token = jwt.sign(
            { id: savedAssistant.id },
            config.get("jwtSecret"),
            { expiresIn: config.get("tokenExpire") }
        );

        res.status(200).send({ status: "ok", msg: "successfully registered", token, assistant: savedAssistant });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});


//login
router.post("/login",(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({error: "Please provide email and pasword"});
    }

    Assistant.findOne({email:email}).then((assistant)=>{
        if(!assistant){
            return res.status(401).json({error:"User not found"});
        }
        bcrypt.compare(password,assistant.password).then((isMatch)=>
        {
            if(!isMatch){
                return res.status(401).json({error:"Incorrect password"});
            }

            jwt.sign(
                {id: assistant.id},
                config.get("jwtSecret"),
                { expiresIn:config.get("tokenExpire")},
                (err,token)=>{
                    if (err){
                        console.error(err);
                        return res.status(500).json({error:"Internal server error"});
                    }
                    return res.status(200).json({token});
                }
            );
        });
    }).catch((err)=>{
        console.error(err);
        return res.status(500).json({error:"Internal server error"});
    });
});

// Lire tous les utilisateurs (READ)
router.get('/all', async (req, res) => {
    try {
      const assistants = await Assistant.find();
      res.status(200).json(assistants);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des assistants', error });
    }
  });

    // Lire un utilisateur par ID (READ)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const assistant = await Assistant.findById(id);
      if (!assistant) {
        return res.status(404).json({ message: 'Assistant non trouvé' });
      }
      res.status(200).json(assistant);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'assistant', error });
    }
  });
  


// Mettre à jour un compte par ID (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, numtel, email, password,adresse, datenaissance, etat,role } = req.body;

    try {
        // Trouver le compte à mettre à jour
        const assistant = await Assistant.findById(id);
        if (!assistant) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        // Mise à jour des champs s'ils existent dans la requête
        if (nom) assistant.nom = nom;
        if (prenom) assistant.prenom = prenom;
        if (numtel) assistant.numtel = numtel;
        if (email) assistant.email = email;
        if (adresse) assistant.adresse = adresse;
        if (datenaissance) assistant.datenaissance = datenaissance;
        if (etat) assistant.etat = etat;
        if (role) assistant.role = role;

        // Si un nouveau mot de passe est fourni, on le hash avant de l'enregistrer
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            assistant.password = hashedPassword;
        }

        // Sauvegarder les modifications
        const updatedAssistant = await assistant.save();
        res.status(200).json({ message: 'Compte mis à jour avec succès', updatedAssistant });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du compte', error });
    }
});
//désactiver compte
// Mettre à jour uniquement l'état d'un compte par ID
router.put('/:id/etat', async (req, res) => {
    const { id } = req.params;
    const { etat } = req.body; // Only expect 'etat' in the body

    try {
        // Trouver le compte à mettre à jour
        const assistant = await Assistant.findById(id);
        if (!assistant) {
            return res.status(404).json({ message: 'Assistant non trouvé' });
        }

        // Mise à jour de l'état
        if (etat) {
            assistant.etat = etat; // Update the etat field
        } else {
            return res.status(400).json({ message: 'L\'état est requis' });
        }

        // Sauvegarder les modifications
        const updatedAssistant = await assistant.save();
        res.status(200).json({ message: 'État du compte mis à jour avec succès', updatedAssistant });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état du compte', error });
    }
});

  
  // Supprimer un utilisateur par ID (DELETE)
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedCompte = await Assistant.findByIdAndDelete(id);
      if (!deletedCompte) {
        return res.status(404).json({ message: 'Assistant non trouvé' });
      }
      res.status(200).json({ message: 'Assistant supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'assistant', error });
    }
  });
  
module.exports=router;