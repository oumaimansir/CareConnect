import { Patient } from "./patient.model";

export interface Rendezvous {
  id? : number;
  patient? : Patient;
  numtel? : number;
  email : string;
  password : string;
  date?:Date;
  heure: string;
  etat: string;
}
