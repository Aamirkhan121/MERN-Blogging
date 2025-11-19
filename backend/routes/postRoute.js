const express = require('express');
const auth = require('../middleware/auth');

const  {createInstagramPost, getAllPosts, getPostBySlug, deletePostBySlug, updatePostBySlug, getPostByUsername, likePost, unlikePost, addComment, getComments, deleteComment}  = require('../controller/post.js');
const postUpload = require('../middleware/postUpload.js');
const router = express.Router();

router.post('/create', auth, postUpload.single('image'), createInstagramPost);
router.get('/all', getAllPosts);
router.get('/:slug', getPostBySlug);
router.put("/update/:slug",auth, postUpload.single('image'),updatePostBySlug)
router.get('/user/:username', getPostByUsername)
router.delete('/delete/:slug',auth, deletePostBySlug);

// LIKE POST
router.post("/:slug/like", auth, likePost);

// UNLIKE POST
router.post("/:slug/unlike", auth, unlikePost);

// ADD COMMENT
router.post("/:slug/comment", auth, addComment);

// GET ALL COMMENTS OF A POST
router.get("/:slug/comments", getComments);

// DELETE COMMENT
router.delete("/:slug/comment/:commentId", auth, deleteComment);
    

module.exports = router;