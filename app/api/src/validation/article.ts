import Joi from "joi";
export const addArticleSchema = Joi.object({
    title: Joi.string().required(),
    content:Joi.object().required(),
    topics:Joi.array().required(),
});