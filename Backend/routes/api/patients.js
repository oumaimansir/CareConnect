const router=require("express").Router();
const bcrypt=require("bcryptjs");
const config=require("config");
const jwt=require("jsonwebtoken");
const Patient=require("../../models/Patient");
router.post("/registerPatient", async (req, res) => {
    try {
        const { nom, prenom, numtel, email, password, adresse, datenaissance, role } = req.body;
        console.log("Received data:", req.body);

        if (!nom || !prenom || !numtel || !email || !password || !role) {
            console.log("Missing required fields");
            return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
        }

        // Vérification si l'email existe déjà
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            console.log("Email already exists");
            return res.status(400).send({ status: "notokemail", msg: "Email already exists" });
        }

        // Créer une nouvelle instance de Patient
        const newPatient = new Patient({
            nom,
            prenom,
            numtel,
            email,
            password,
            adresse,
            datenaissance,
            role,
        });

        console.log("New account object:", newPatient);

        // Générer le salt et hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        newPatient.password = await bcrypt.hash(newPatient.password, salt);

        // Sauvegarder le patient dans la base de données
        const savedPatient = await newPatient.save();
        console.log("Account saved successfully:", savedPatient);

        // Générer un token JWT
        const token = jwt.sign(
            { id: savedPatient.id },
            config.get("jwtSecret"),
            { expiresIn: config.get("tokenExpire") }
        );

        res.status(200).send({ status: "ok", msg: "successfully registered", token, patient: savedPatient });
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
    

    Patient.findOne({email:email}).then((patient)=>{
        if(!patient){
            return res.status(401).json({error:"User not found"});
        }
        bcrypt
        .compare(password, patient.password)
        .then((isMatch) => {
            if (!isMatch) {
                return res.status(401).json({ error: "Incorrect password" });
            }
            // Génération du token JWT
            jwt.sign(
                { id: patient.id },
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
      const patients = await Patient.find();
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
    }
  });

    // Lire un utilisateur par ID (READ)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const patient = await Patient.findById(id);
      if (!patient) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
    }
  });
  


// Mettre à jour un compte par ID (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, numtel, email, password,adresse, datenaissance, etat, role } = req.body;

    try {
        // Trouver le compte à mettre à jour
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        // Mise à jour des champs s'ils existent dans la requête
        if (nom) patient.nom = nom;
        if (prenom) patient.prenom = prenom;
        if (numtel) patient.numtel = numtel;
        if (email) patient.email = email;
        if (adresse) patient.adresse = adresse;
        if (datenaissance) patient.datenaissance = datenaissance;
        if (etat) patient.etat = etat;
        if (role) patient.role = role;

        // Si un nouveau mot de passe est fourni, on le hash avant de l'enregistrer
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            patient.password = hashedPassword;
        }

        // Sauvegarder les modifications
        const updatedPatient = await patient.save();
        res.status(200).json({ message: 'Compte mis à jour avec succès', updatedPatient });
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
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        // Mise à jour de l'état
        if (etat) {
            patient.etat = etat; // Update the etat field
        } else {
            return res.status(400).json({ message: 'L\'état est requis' });
        }

        // Sauvegarder les modifications
        const updatedPatient = await patient.save();
        res.status(200).json({ message: 'État du compte mis à jour avec succès', updatedPatient });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état du compte', error });
    }
});

  
  // Supprimer un utilisateur par ID (DELETE)
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedPatient = await Patient.findByIdAndDelete(id);
      if (!deletedPatient) {
        return res.status(404).json({ message: 'Patient non trouvé' });
      }
      res.status(200).json({ message: 'Patient supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de patient', error });
    }
  });
  
module.exports=router;