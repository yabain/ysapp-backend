import { PartialType } from "@nestjs/mapped-types";
import { CreateGroupDTO } from "./create-group.dto";

/**
 * @apiDefine UpdateGroupDTO Mise à jour d'un groupe
 * @apiBody {String {4..65}} [name] Nom du groupe
 * @apiBody {String {4..65}} [description] description du groupe
 * @apiBody {String} [profilePicture] Lien de la photo de profil du groupe
 */
export class UpdateGroupDTO extends PartialType(CreateGroupDTO){}