const express = require("express");
const fetchuser = require("../middleware/fetchUser");
const router = express.Router();
const Posts = require("../models/Posts");
const { body, validationResult } = require("express-validator");

//Rout 1: GET all the posts: POST "/api/posts/fetchallposts" Login require
router.post("/fetchallposts", fetchuser, async (req, res) => {
  try {
    //This will fetch all the posts
    const posts = await Posts.find();
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Oops some thing went wrong!!");
  }
});

//Rout 2: add a posts: POST "/api/posts/addpost" Login require
router.post("/addpost",fetchuser,[
     body('itemName', "Name should be at least 3 characters").isLength({ min:3 }),
     body('collectFrom', 'Collection address must be at least 5 characters').isLength({min:5}),
     body('image', 'Please select an image').notEmpty()
  ],async (req, res) => {
    const { itemName, collectFrom, contact, description, image } = req.body;

    try {
      const post = new Posts({
        itemName,
        collectFrom,
        image,
        contact,
        description,
        user: req.user.id
      });
      const savePost = await post.save();
      res.json(savePost);
    } catch (error) {
      res.status(500).send("Oops some thing went wrong!!");
    }
  }
);

//Rout 3: update the posts: PUT "/api/posts/updatepost" Login require
//:id is for taking the specific id of an post which we want to edit
router.put("/updatepost/:id", fetchuser, async (req, res) => {
  const { itemName, collectFrom, image, contact, description } = req.body;
  try {
    const newPost = {};
    if (itemName) {
      newPost.itemName = itemName;
    }
    if (collectFrom) {
      newPost.collectFrom = collectFrom;
    }
    if (image) {
      newPost.image = image;
    }
    if (contact) {
      newPost.contact = contact;
    }
    if (description) {
      newPost.description = description;
    }
    //Check weather the post with requested id is preaent or not
    //here params.id means the id we have passed by the url
    let post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Not found");
    }
    //Check weather user owens the post
    if (post.user.toString() !== req.user.id) {
      return res.status(404).send("Not Allowed");
    }
    //Find the post to be updated
    post = await Posts.findByIdAndUpdate(
      req.params.id,
      { $set: newPost },
      { new: true }
    );
    res.json({ post });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Oops some thing went wrong!!");
  }
});

//Rout 4:delete the post: delete "/api/posts/deletepost" Login require
router.delete("/deletepost/:id", fetchuser, async (req, res) => {
  try {
    // Find the post to be deleted
    let post = await Posts.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Not found");
    }

    //Allow deletion only if user owens this post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    //Delete the post
    post = await Posts.findByIdAndDelete(req.params.id);
    res.json("Post has been deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Oops some thing went wrong!!");
  }
});

module.exports = router;
