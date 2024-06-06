import Joi from "joi";
export const addArticleSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    subTitle: Joi.string().min(3).max(75).required(),
    content: Joi.string().min(3).required(),
    topics: Joi.array().required().max(5),
});