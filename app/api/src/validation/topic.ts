import Joi from "joi";
const addTopic = Joi.object({
    title:Joi.string().min(2).required(),
    subTopics:Joi.array().required(),
});
const editTopic = Joi.object({
    
})
export default {addTopic};