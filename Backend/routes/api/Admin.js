const router=require("express").Router();
const bcrypt=require("bcryptjs");
const config=require("config");
const jwt=require("jsonwebtoken");
const Admin=require("../../models/Admin");

router.post("/registerAdmin", async (req, res) => {
    try {
        const { nom, prenom, numtel, email, password, adresse, datenaissance, role } = req.body;
        console.log("Received data:", req.body);

        if (!nom || !prenom || !numtel || !email || !password || !role) {
            console.log("Missing required fields");
            return res.status(400).send({ status: "notok", msg: "Please enter all required data" });
        }

        // Vérification si l'email existe déjà
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log("Email already exists");
            return res.status(400).send({ status: "notokemail", msg: "Email already exists" });
        }

        // Créer une nouvelle instance de Patient
        const newAdmin = new Admin({
            nom,
            prenom,
            numtel,
            email,
            password,
            adresse,
            datenaissance,
            role,
        });

        console.log("New account object:", newAdmin);

        // Générer le salt et hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        newAdmin.password = await bcrypt.hash(newAdmin.password, salt);

        // Sauvegarder le patient dans la base de données
        const savednewAdmin = await newAdmin.save();
        console.log("Account saved successfully:", savednewAdmin);

        // Générer un token JWT
        const token = jwt.sign(
            { id: savednewAdmin.id },
            config.get("jwtSecret"),
            { expiresIn: config.get("tokenExpire") }
        );

        res.status(200).send({ status: "ok", msg: "Admin successfully registered", token, admin: savednewAdmin });
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

    Admin.findOne({email:email}).then((admin)=>{
        if(!admin){
            return res.status(401).json({error:"User not found"});
        }
        bcrypt.compare(password,admin.password).then((isMatch)=>
        {
            if(!isMatch){
                return res.status(401).json({error:"Incorrect password"});
            }

            jwt.sign(
                {id: admin.id},
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
      const admins = await Admin.find();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des admins', error });
    }
  });

    // Lire un utilisateur par ID (READ)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const admin = await Admin.findById(id);
      if (!admin) {
        return res.status(404).json({ message: 'admin non trouvé' });
      }
      res.status(200).json(admin);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'admin', error });
    }
  });
  


// Mettre à jour un compte par ID (UPDATE)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, numtel, email, password,adresse, datenaissance, etat, role } = req.body;

    try {
        // Trouver le compte à mettre à jour
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        // Mise à jour des champs s'ils existent dans la requête
        if (nom) admin.nom = nom;
        if (prenom) admin.prenom = prenom;
        if (numtel) admin.numtel = numtel;
        if (email) admin.email = email;
        if (adresse) admin.adresse = adresse;
        if (datenaissance) admin.datenaissance = datenaissance;
        if (etat) admin.etat = etat;
        if (role) admin.role = role;

        // Si un nouveau mot de passe est fourni, on le hash avant de l'enregistrer
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            admin.password = hashedPassword;
        }

        // Sauvegarder les modifications
        const updatedAdmin = await admin.save();
        res.status(200).json({ message: 'Compte mis à jour avec succès', updatedAdmin });
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
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin non trouvé' });
        }

        // Mise à jour de l'état
        if (etat) {
            admin.etat = etat; // Update the etat field
        } else {
            return res.status(400).json({ message: 'L\'état est requis' });
        }

        // Sauvegarder les modifications
        const updatedAdmin = await admin.save();
        res.status(200).json({ message: 'État du compte mis à jour avec succès', updatedAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'état du compte', error });
    }
});

  
  // Supprimer un utilisateur par ID (DELETE)
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedAdmin= await Admin.findByIdAndDelete(id);
      if (!deletedAdmin) {
        return res.status(404).json({ message: 'Admin non trouvé' });
      }
      res.status(200).json({ message: 'Admin supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'admin', error });
    }
  });
  
module.exports=router;