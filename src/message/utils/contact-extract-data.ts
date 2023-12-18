import { Contact } from "src/contact/models";

export class ContactExtractData
{
    static getWhatsappPhone(contact:Contact)
    {
        return contact.phoneNumbers.find((phone)=>phone.label=="whatsapp");
    }

    static getDefaultMail(contact:Contact)
    {
        return contact.emails.find((email)=> email.label=="default")
    }
}