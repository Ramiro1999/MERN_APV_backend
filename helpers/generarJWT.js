import jwt from 'jsonwebtoken'
import dotenv from 'dotenv/config'

const generarJWT = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: "30d",
    });
}

export default generarJWT;