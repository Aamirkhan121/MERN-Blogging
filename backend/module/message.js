const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    type: {
  type: String,
  enum: ["text", "image"],
  default: "text",
},
isDeleted: {
  type: Boolean,
  default: false,
}


  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;


