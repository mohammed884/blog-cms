import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    title:{
        type: String,
        trim:true,
        required: true,
        unique: true,
    },
    subInterests:{
        type:[{
            title: {
                type: String,
                required: true,
            },
            createdAt:{
                type: Date,
                required: true
            }
        }]
    },
    createdAt:{
        type: Date,
        required: true
    },
});
type InterestType = mongoose.InferSchemaType<typeof Schema>;
const Interest = mongoose.model<InterestType>('Interest', Schema);

export default Interest;