import express from "express";
import { commentPost, createPost, deletePost, editPost, getAllPost, getPost, likePost, findPostsByTags } from "../controllers/post.controller.js";
import verifyUserJWT from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
const router =express.Router();
// Configure multer to handle image uploads
const uploadFields = upload.fields([
    {
        name: 'image_file',
        maxCount: 1
    }
]);
// posting a post
router.route("/create-post").post(verifyUserJWT,uploadFields,createPost)


// get a post
router.route("/:id").get(getPost)
// edit a post
router.route("/:id").put(editPost)

// delete a post
router.route("/:id").delete(deletePost)

// get all post
router.route("/").get(getAllPost)
//add comment
router.route("/add-comment/:id").post(verifyUserJWT,commentPost)
// like a post
router.route("/like-post/:id").post(verifyUserJWT,likePost)
// find posts by tags
router.route("/find-by-tags").post(findPostsByTags);
export default router;