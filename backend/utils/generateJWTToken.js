import jwt from "jsonwebtoken"

export const generateJWTToken = (res, id) => {
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign({id:id}, secretKey, { expiresIn: '7d' });

    // send cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return token;
}