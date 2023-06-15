import { PartialType } from "@nestjs/mapped-types";
import { CreateContactDTO } from "./create-contact.dto";

/**
 * @apiDefine UpdateContactDTO Mise a jour d'un contact
 * @apiBody {String {4..65}} [firstName] Prenom du contact
 * @apiBody {String {4..65}} [lastName] Nom du contact
 * @apiBody {String} [email] Email du contact
 * @apiBody {String} [profilePicture] Lien de la photo de profil du contact
 * @apiBody {String} [country] Pays d'habitation du contact
 * @apiBody {String} [whatsappContact] Numero whatsapp du contact
 * @apiBody {String} [skype] Contact skype 
 * @apiBody {String} [websiteLink] Lien du site web du contact 
 * @apiBody {String} [location] Zone de localisation du contact
 * @apiBody {String} [phoneNumber] Autre numéro de téléphone du contact
 */
export class UpdateContactDTO extends PartialType(CreateContactDTO){}