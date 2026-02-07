import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) throw new Error("JWT String missing")
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,///7 days in miliseconds
        httpOnly: true,///prevent attacks
        sameSite: "lax", ////CSRF Attacks
        secure: process.env.NODE_ENV === "development" ? false : false

    })
    return token;
}