const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

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
    community: {
      type: String,
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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
