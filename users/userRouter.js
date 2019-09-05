const express = require("express");

const router = express.Router();

const userdb = require("./userDb");
const postdb = require("../posts/postDb");

router.post("/", validateUser, (req, res) => {
  const user = req.body;

  userdb
    .insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const post = req.body;
  postdb
    .insert(post)
    .then(post => res.status(201).json(post))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error adding user's posts" });
    });
});

router.get("/", (req, res) => {
  userdb
    .get()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Could not retrieve users" });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  userdb
    .getUserPosts(id)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error getting user posts" });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  userdb
    .remove(id)
    .then(() => res.status(204).end())
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "failed to delete user" });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  const name = req.body;

  userdb
    .update(id, name)
    .then(() => {
      userdb
        .getById(id)
        .then(user => res.status(200).json(user))
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "error getting this user" });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error updating this user" });
    });
});
//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;

  userdb
    .getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ errorMessage: "This is not a user id" });
      }
    })
    .catch(() => res.status(500).json({ errorMessage: "error" }));
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  if (typeof name !== "string") {
    return res.status(400).json({ err: "name must be text" });
  }
  req.body = { name };
  next();
}

function validatePost(req, res, next) {
  const { id: user_id } = req.params;
  const { text } = req.body;
  if (!req.body) {
    return res.status(400).json({ error: "posts require a body" });
  }
  if (!text) {
    return res.status(400).json({ error: "post needs text" });
  }
  req.body = { user_id, text };
  next();
}

module.exports = router;
