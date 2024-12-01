const router=require("express").Router();
const bcrypt=require("bcryptjs");
const config=require("config");
const jwt=require("jsonwebtoken");
const Docteur=require("../../models/Docteur");
router.post("/registerDocteur", async (req, res) => {
    try {
        const { nom, prenom, numtel, email, password, adresse, datenaissance, role, specialite } = req.body;
        console.log("Received data:", req.body);

        if (!nom || !prenom || !numtel || !email || !password || !role || !specialite) {
            console.log("Missing required fields");
            return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
        }

        // Vérification si l'email existe déjà
        const existingDocteur = await Docteur.findOne({ email });
        if (existingDocteur) {
            console.log("Email already exists");
            return res.status(400).send({ status: "notokemail", msg: "Email already exists" });
        }

        // Créer une nouvelle instance de Patient
        const newDocteur = new Docteur({
            nom,
            prenom,
            numtel,
            email,
            password,
            adresse,
            datenaissance,
            role,
            specialite,
        });

        console.log("New account object:", newDocteur);

        // Générer le salt et hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        newDocteur.password = await bcrypt.hash(newDocteur.password, salt);

        // Sauvegarder le patient dans la base de données
        const savedDocteur = await newDocteur.save();
        console.log("Account saved successfully:", savedDocteur);

        // Générer un token JWT
        const token = jwt.sign(
            { id: savedDocteur.id },
            config.get("jwtSecret"),
            { expiresIn: config.get("tokenExpire") }
        );

        res.status(200).send({ status: "ok", msg: "successfully registered", token, docteur: savedDocteur });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).send({ status: "error", msg: "Internal server error" });
    }
});


//login
router.post("/login",(req,res)=>{
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }
    
    // Vérifiez que `email` et `password` sont des chaînes de caractères
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "Email and password must be valid strings" });
    }
    

    Docteur.findOne({email:email}).then((docteur)=>{
        if(!docteur){
            return res.status(401).json({error:"User not found"});
        }
        bcrypt
        .compare(password, docteur.password)
        .then((isMatch) => {
            if (!isMatch) {
                return res.status(401).json({ error: "Incorrect password" });
            }
            // Génération du token JWT
            jwt.sign(
                { id: docteur.id },
                config.get("jwtSecret"),
                { expiresIn: config.get("tokenExpire") },
                (err, token) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: "Internal server error" });
                    }
                    return res.status(200).json({ token });
                }
            );
        })
        .catch((err) => {
            console.error("Error during bcrypt comparison:", err);
            return res.status(500).json({ error: "Internal server error" });
        });
    
    }).catch((err)=>{
        console.error(err);
        return res.status(500).json({error:"Internal server error"});
    });
});


// Lire tous les utilisateurs (READ)
router.get('/all', async (req, res) => {
    try {
      const docteurs = await Docteur.find();
      res.status(200).json(docteurs);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
    }
  });

    // Lire un utilisateur par ID (READ)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const docteur = await Docteur.findById(id);
      if (!docteur) {
        return res.status(404).json({ message: 'Docteur non trouvé' });
      }
      res.status(200).json(docteur);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de docteur', error });
    }
  });
  


// Mettre à jour un compte par ID (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, numtel, email, password,adresse, datenaissance, etat, role, specialite } = req.body;

    try {
        // Trouver le compte à mettre à jour
        const docteur = await Docteur.findById(id);
        if (!docteur) {
            return res.status(404).json({ message: 'Docteur non trouvé' });
        }

        // Mise à jour des champs s'ils existent dans la requête
        if (nom) docteur.nom = nom;
        if (prenom) docteur.prenom = prenom;
        if (numtel) docteur.numtel = numtel;
        if (email) docteur.email = email;
        if (adresse) docteur.adresse = adresse;
        if (datenaissance) docteur.datenaissance = datenaissance;
        if (etat) docteur.etat = etat;
        if (role) docteur.role = role;

        // Si un nouveau mot de passe est fourni, on le hash avant de l'enregistrer
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            docteur.password = hashedPassword;
        }

        // Sauvegarder les modifications
        const updatedDocteur = await docteur.save();
        res.status(200).json({ message: 'Compte mis à jour avec succès', updatedDocteur });
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
        const docteur = await Docteur.findById(id);
        if (!docteur) {
            return res.status(404).json({ message: 'Docteur non trouvé' });
        }

        // Mise à jour de l'état
        if (etat) {
            docteur.etat = etat; // Update the etat field
        } else {
            return res.status(400).json({ message: 'L\'état est requis' });
        }

        // Sauvegarder les modifications
        const updatedDocteur = await docteur.save();
        res.status(200).json({ message: 'État du compte mis à jour avec succès', updatedDocteur });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état du compte', error });
    }
});

  
  // Supprimer un utilisateur par ID (DELETE)
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedDocteur = await Docteur.findByIdAndDelete(id);
      if (!deletedDocteur) {
        return res.status(404).json({ message: 'Docteur non trouvé' });
      }
      res.status(200).json({ message: 'Docteur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de docteur', error });
    }
  });
  
module.exports=router;