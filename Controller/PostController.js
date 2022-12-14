import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import userModel from "../Models/userModel.js";

// tạo bài viết
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body)

    try {
        await newPost.save()
        res.status(209).json(newPost)
    } catch (error) {
        res.status(500).json(error)
    }
}


export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}


export const UpdatePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body

    try {
        const post = await PostModel.findById(postId)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post updated!")
        } else {
            res.status(403).json("Action forbidden")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}


export const deletePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body

    try {
        const post = await PostModel.findById(id)

        if (post.userId === userId) {

            await post.deleteOne();
            res.status(200).json("Post deleted successfully!")

        } else {
            res.status(403).json("Action forbidden")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

// like/ dislike
export const likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body

    try {
        const post = await PostModel.findById(id)

        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
            res.status(200).json("Post Liked")
        } else {
            await post.updateOne({ $pull: { likes: userId } })
            res.status(200).json("Post UnLiked")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


export const getTimeLinePosts = async (req, res) => {
    const userId = req.params.id;

    try {

        const currentUserPosts = await PostModel.find({ userId: userId })
        const followingPosts = await userModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])

        res.status(200)
            .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
                .soft((a, b) => {
                    return b.createdAt = a.createdAt
                })
            );

    } catch (error) {
        res.status(500).json(error)
    }
}