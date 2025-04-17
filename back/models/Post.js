import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Musis & Dance', 'Clothing & Fashion', 'Food & Cuisine', 'Religious Practices & Beliefs', 'Languages & Culture', 'Festivals & Holidays', 'Literature & Poetry', 'Customs & Traditions', 'Sports & Games', 'Architecture & Design', 'Film & Theatre', 'Folk Tales & Legends', 'Etiquette & Social Norms'],
        required: true
    }, 
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);