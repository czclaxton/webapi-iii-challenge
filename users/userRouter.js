const express = "express";

const router = require("express").Router();

const db = require("./userDb");
// const db2 = require("../posts/postDb")

router.post("/", (req, res) => {
  const name = req.body;
  db.insert(name)
    .then(id => {
      res.status(201).json(id);
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: "There was an error while saving the user to the database"
      });
    });
});

router.post("/:id/posts", (req, res) => {});

router.get("/", (req, res) => {
  db.get()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Could not retrieve users" });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.getById(id).then(user => {
    console.log(user);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "The user with that id does not exist." });
    }
  });
});

router.get("/:id/posts", (req, res) => {
  const id = req.params.id;
  db.getUserPosts(id).then(posts => res.status(200).json(posts));
});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  console.log("validating user id");
  const id = req.params.id;

  db.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ errorMessage: "This is not a user id" });
      }
    })
    .catch(() => res.status(500).json({ errorMessage: "error" }));
}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
