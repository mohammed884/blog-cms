import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../domains/user/models/user"
const JWT_SECRET = process.env.JWT_SECRET;
interface verifyInterface {
    success: boolean,
    err?: string
    decoded?: string | JwtPayload,
}
export const signToken = (_id: string, options: object = { expiresIn: "30d" }) => {
    try {
        return jwt.sign({ _id }, JWT_SECRET, options);
    } catch (err) {
        console.log("JWT error during singing a toke", err);
    }
}
export const verifyToken = (token: string): verifyInterface => {
    try {
        let result: verifyInterface;
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return result = { ...result, success: false, err: err.message };
            return result = { ...result, success: true, decoded }
        });
        return result;
    } catch (err) {
        if (err) {
            console.log(err);
            return { success: true, err: err }
        }
    }
};
export const getUserFromToken = async (token: string) => {
    const validation = verifyToken(token);
    return await User.findById(validation.decoded);
};
