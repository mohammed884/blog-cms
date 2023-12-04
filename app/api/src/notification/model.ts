import mongoose from "mongoose";
//Bucket design the notifications limt foreach document is 50 
const Schema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    notifications: {
        type: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                retrieveId: {
                    type: String,
                    required: true
                },
                article: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Article',
                    required: true
                },
                seen: {
                    type: Boolean,
                    default: false
                },
                type: {
                    type: String,
                    enum: ["comment", "reply", "collaboration"]
                },
                createdAt: {
                    type: Date,
                    required: true
                }
            }
        ],
    },
    notificationsCount: {
        type: Number,
        default: 1
    },
});
Schema.set("timestamps", true);
type NotificationType = mongoose.InferSchemaType<typeof Schema>;
const Notification = mongoose.model<NotificationType>('Notification', Schema);
export default Notification;
