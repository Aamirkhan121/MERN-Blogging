const Post = require('../module/postmodule');
const cloudinary = require("../config/cloudinary");
const shortid = require('shortid');
const User = require('../module/usermodule');

// Create a new post

exports.createInstagramPost = async (req, res) => {
  try {
    const { title, caption } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    // Upload file buffer to Cloudinary
    cloudinary.uploader.upload_stream(
      { folder: "posts" },
      async (error, result) => {
        if (error) return res.status(500).json({ message: error.message });

        const post = await Post.create({
          title,
          caption,
          image: result.secure_url,
          username: req.user.username,
          author: req.user._id,
        });

        res.status(200).json({ success: true, message: "Post created!", post });
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

//get post by id
exports.getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
};

//update post by slug 

exports.updatePostBySlug=async(req,res)=>{
  try{
    const slug = req.params.slug;
     
    //find post first
    const post = await Post.findOne({slug});
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }
    //check if logged in user is the author of the post
    if(post.author.toString() !== req.user._id.toString()){
      return res.status(403).json({message:"You are not authorized to update this post"});
    }
    //update fields post
    const updatedData={
      title:req.body.title || post.title,
      caption:req.body.caption || post.caption,
    };
    //if title is updated, slug will be updated automatically due to pre-save hook in model
      if(req.body.title && req.body.title !== post.title){
         const newSlug= req.body.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "") + "-" +
        shortid.generate();
        updatedData.slug=newSlug;
      }

    // If image uploaded → update image URL
    if (req.file) {
      updatedData.image = req.file.url;
    }

    // Update the post
    const updatedPost = await Post.findOneAndUpdate({slug}, updatedData, {new:true});
    res.status(200).json({message:"Post updated successfully",post:updatedPost});
    
  }
  catch(error){
    res.status(500).json({message:"Error updating post",error:error.message});
  }
};

//delete post by slug
exports.deletePostBySlug=async(req,res)=>{
  try{
    const slug=req.params.slug;
    //find post first
    const post=await Post.findOne({slug});
    if(!post){
      return res.status(404).json({message:"Post not found"});
    }
    //check if logged in user is the author of the post
    if(post.author.toString() !== req.user._id.toString()){
      return res.status(403).json({message:"You are not authorized to delete this post"});
    }
    // Delete the post
    await Post.findOneAndDelete({slug});
    res.status(200).json({message:"Post deleted successfully"});
    }catch(error){
    res.status(500).json({message:"Error deleting post",error:error.message});
  }
}

// get posts by username
exports.getPostByUsername = async (req, res) => {
  try {
    const username = req.params.username;
   // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find posts by user
    const posts = await Post.find({ username })
      .sort({ createdAt: -1 }); // latest posts first

      res.status(200).json({
      success: true,
      total: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
}


// POST /api/posts/:slug/like
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({ message: "Post not found" });

    // If already liked → return
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Already liked the post" });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.status(200).json({
      message: "Post liked",
      likesCount: post.likes.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// POST /api/posts/:slug/unlike
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes = post.likes.filter(
      id => id.toString() !== req.user._id.toString()
    );

    await post.save();

    res.status(200).json({
      message: "Post unliked",
      likesCount: post.likes.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// POST /api/posts/:slug/comment
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!req.body.text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const newComment = {
      user: req.user._id,
      username: req.user.username,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      message: "Comment added",
      comment: newComment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/posts/:slug/comments
exports.getComments = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("comments.user", "username email");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({
      comments: post.comments
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/posts/:slug/comment/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const { slug, commentId } = req.params;

    const post = await Post.findOne({ slug });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    // CONDITIONS
    const isCommentOwner =
      comment.user.toString() === req.user._id.toString();

    const isPostOwner =
      post.author.toString() === req.user._id.toString();

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ message: "Not authorized to delete comment" });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({ message: "Comment deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

