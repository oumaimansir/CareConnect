const router=require("express").Router();
const bcrypt=require("bcryptjs");
const config=require("config");
const jwt=require("jsonwebtoken");
const Compte=require("../../models/Compte");


//login
router.post("/login",(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({error: "Please provide email and pasword"});
    }

    Compte.findOne({email:email}).then((compte)=>{
        console.log('Fetched Compte:', compte);
        if(!compte){
            return res.status(401).json({error:"USer not found"});
        }
        bcrypt.compare(password,compte.password).then((isMatch)=>
        {
            if(!isMatch){
                return res.status(401).json({error:"Incorrect password"});
            }

            jwt.sign(
                {id: compte.id},
                config.get("jwtSecret"),
                { expiresIn:config.get("tokenExpire")},
                (err,token)=>{
                    if (err){
                        console.error(err);
                        return res.status(500).json({error:"Internal server error"});
                    }
                    return res.status(200).json({

                     // compte,
                      token:token,
                     nom: compte.nom,
                    prenom: compte.prenom,
                    role:compte.role // Ensure these fields exist in your model

                        });
                }
            );
        });
    }).catch((err)=>{
        console.error(err);
        return res.status(500).json({error:"Internal server error"});
    });
});

router.post("/register", (req, res) => {
    const { nom, prenom, numtel, email, password, adresse, datenaissance } = req.body;
    console.log("Received data:", req.body);  // Vérifie les données reçues

    if (!nom || !prenom || !numtel || !email || !password) {
        console.log("Missing required fields");
        return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
    }

    // Vérification si l'email existe déjà
    Compte.findOne({ email: email })
        .then((compte) => {
            if (compte) {
                console.log("Email already exists");
                return res.status(400).send({ status: "notokemail", msg: "Email already exists" });
            }

            // Créer une nouvelle instance de Compte
            const newCompte = new Compte({
                nom,
                prenom,
                numtel,
                email,
                password,
                adresse,
                datenaissance,
            });

            console.log("New account object:", newCompte);

            // Générer le salt et hasher le mot de passe
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log("Error generating salt:", err);
                    return res.status(500).send({ status: "error", msg: "Internal server error" });
                }

                bcrypt.hash(newCompte.password, salt, (err, hash) => {
                    if (err) {
                        console.log("Error hashing password:", err);
                        return res.status(500).send({ status: "error", msg: "Internal server error" });
                    }

                    newCompte.password = hash;

                    // Sauvegarder le compte dans la base de données
                    newCompte.save()
                        .then((compte) => {
                            console.log("Account saved successfully:", compte);
                            jwt.sign(
                                { id: compte.id },
                                config.get("jwtSecret"),
                                { expiresIn: config.get("tokenExpire") },
                                (err, token) => {
                                    if (err) {
                                        console.log("Error generating token:", err);
                                        return res.status(500).send({ status: "error", msg: "Internal server error" });
                                    }

                                    res.status(200).send({ status: "ok", msg: "successfully registered", token, compte });
                                }
                            );
                        })
                        .catch((err) => {
                            console.log("Error saving account:", err);
                            return res.status(500).send({ status: "error", msg: "Internal server error" });
                        });
                });
            });
        })
        .catch((err) => {
            console.log("Error finding email:", err);
            return res.status(500).send({ status: "error", msg: "Internal server error" });
        });
});

// Lire tous les utilisateurs (READ)
router.get('/all', async (req, res) => {
    try {
      const comptes = await Compte.find();
      res.status(200).json(comptes);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
    }
  });

    // Lire un utilisateur par ID (READ)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const compte = await Compte.findById(id);
      if (!compte) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json(compte);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
    }
  });
  


// Mettre à jour un compte par ID (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, numtel, email, password,adresse, datenaissance, etat } = req.body;

    try {
        // Trouver le compte à mettre à jour
        const compte = await Compte.findById(id);
        if (!compte) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        // Mise à jour des champs s'ils existent dans la requête
        if (nom) compte.nom = nom;
        if (prenom) compte.prenom = prenom;
        if (numtel) compte.numtel = numtel;
        if (email) compte.email = email;
        if (adresse) compte.adresse = adresse;
        if (datenaissance) compte.datenaissance = datenaissance;
        if (etat) compte.etat = etat;

        // Si un nouveau mot de passe est fourni, on le hash avant de l'enregistrer
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            compte.password = hashedPassword;
        }

        // Sauvegarder les modifications
        const updatedCompte = await compte.save();
        res.status(200).json({ message: 'Compte mis à jour avec succès', updatedCompte });
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
        const compte = await Compte.findById(id);
        if (!compte) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        // Mise à jour de l'état
        if (etat) {
            compte.etat = etat; // Update the etat field
        } else {
            return res.status(400).json({ message: 'L\'état est requis' });
        }

        // Sauvegarder les modifications
        const updatedCompte = await compte.save();
        res.status(200).json({ message: 'État du compte mis à jour avec succès', updatedCompte });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état du compte', error });
    }
});

  
  // Supprimer un utilisateur par ID (DELETE)
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedCompte = await Compte.findByIdAndDelete(id);
      if (!deletedCompte) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
    }
  });

  // Route pour récupérer un compte par email
router.post('/email', async (req, res) => {
    const { email } = req.body;

    try {
        const compte = await Compte.findOne({ email: email });
        if (!compte) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        res.status(200).json(compte);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du compte', error });
    }
});

 
module.exports=router;