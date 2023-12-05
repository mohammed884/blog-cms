import User from "../domains/user/models/user";
/*
    this function will check the user that is making a request to do something if he is blocked
    REQUIREMENTS
    - logged in && confirmed
    - a user to check if he blocked the requesting user
*/
const isBlocked = (user) => {
    try {
        return async (req, res, next) => {
            const currentUser = req.user;
        }
    } catch (err) {
        console.log(err);
    }
};