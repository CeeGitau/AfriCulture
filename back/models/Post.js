const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Food & Cuisine",
        "Clothing & Fashion",
        "Music & Dance",
        "Languages & Culture",
        "Festivals & Holidays",
        "Arts & Handicrafts",
        "Literature & Poetry",
        "Customs & Traditions",
        "Religious Practices & Beliefs",
        "Sports & Games",
        "Architecture & Design",
        "Films & Theatre",
        "Etiquette & Social Norms"
      ],      
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // base64 image string
    },
    audio: {
      type: String, // base64 audio string
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
