const bcrypt=require("bcryptjs")

export class PasswordUtil
{
    static hash(password:string):string
    {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    static compare(savedPassword:string,newPassword:string):boolean
    {
        // console.log("user ",savedPassword,newPassword,bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)))
        return bcrypt.compareSync(newPassword,savedPassword)
    }
}