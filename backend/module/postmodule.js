const mongoose = require('mongoose');
const shortid = require('shortid');


const postSchema= new mongoose.Schema({
     title: {type: String,required: true},
    caption:{type:String,required:true},
    image:{type:String,required:false},
    slug: {type: String,unique: true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    username:{type:String,required:true},
    // ❤️ LIKES SYSTEM
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    // 💬 COMMENTS SYSTEM
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: String,
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        }
      }
    ]
},{timestamps:true});

// ----- SLUG AUTO GENERATE -----
postSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = this.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

    let finalSlug = baseSlug;

    const existing = await mongoose.models.Post.findOne({ slug: finalSlug });

    if (existing) {
      finalSlug = `${baseSlug}-${shortid.generate()}`;
    }

    this.slug = finalSlug;
  }

  next();
});

const Post= mongoose.model("Post",postSchema);
module.exports=Post;