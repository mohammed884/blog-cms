import mongoose from "mongoose";
//Bucket design the notifications limt foreach document is 50 
const Schema = new mongoose.Schema({
    notificationTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notifications: {
        type: [
            {
                notificationBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                message: {
                    type: String,
                    required: true
                },
                article: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Article',
                    required: true
                },
                createdAt:{
                    type:Date,
                    required: true
                }
            }
        ],
        // validate: [50, '{PATH} exceeds the limit of 50']
    },
    count:{
        type:Number,
        default:50
    },
    createdAt: {
        type: Date,
        required: true
    }
});
type NotificationType = mongoose.InferSchemaType<typeof Schema>;
const Notification = mongoose.model<NotificationType>('Notification', Schema);
export default Notification;
