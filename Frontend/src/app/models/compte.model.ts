export interface Compte {
    id? : string;
    nom : string;
    prenom : string;
    numtel : Number;
    email : string;
    password : string;
    adresse : string;
    datenaissance : Date;
    etat : string;
    token:string;
    role:string
}