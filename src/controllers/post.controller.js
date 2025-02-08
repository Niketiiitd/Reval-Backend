import { Post, Comment } from '../models/post.model.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = async (req, res) => {
    try {
        const { content, tags } = req.body;
        const image_file = req.files?.image_file?.[0];
        const currentDate = new Date();
        const expirationDate = new Date(currentDate);
        expirationDate.setDate(expirationDate.getDate() + 90);
        const expirationDateString = expirationDate.toISOString();
        const author = req.user._id; // Assuming user is attached to req.user by authentication middleware

        if (image_file) {
            const result = await uploadOnCloudinary(image_file.path);
            if (!result) {
                return res.status(500).json({ ans: "fail" });
            }

            const post = await Post.create({
                content: content,
                tags: tags,
                image: result.secure_url,
                author: author
            });

            if (!post) res.status(400).json({ message: "Post not created" });
            res.status(201).json(post);
        } else {
            const post = await Post.create({
                content: content,
                tags: tags,
                author: author
            });

            if (!post) res.status(400).json({ message: "Post not created" });
            res.status(201).json(post);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author').populate('comments.user');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editPost = async (req, res) => {
    try {
        const { content, tags, image } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post.content = content;
        post.tags = tags;
        post.image = image;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().populate('author').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await post.remove();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({ message: "You already liked this post" });
        }
        post.likes.push(req.user._id);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const commentPost = async (req, res) => {
    const { text } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = new Comment({ text, user: req.user._id });
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createPost, getPost, editPost, getAllPost, deletePost, likePost, commentPost };