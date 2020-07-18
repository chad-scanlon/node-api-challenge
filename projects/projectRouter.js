const express = require("express");
const Projects = require("../data/helpers/projectModel.js");
const Actions = require("../data/helpers/actionModel");

const router = express.Router();

// get the projects
router.get("/", (req, res) => {
  Projects.get(res.body)
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving the project" });
    });
});
router.get("/:id", (req, res) => {
  Projects.get(req.params.id)
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error retrieving the project" });
    });
});

// add a project
router.post("/", (req, res) => {
  Projects.insert(req.body)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error adding the project" });
    });
});

// update a project
router.put("/:id", (req, res) => {
  const changes = req.body;
  Projects.update(req.params.id, changes)
    .then((project) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: "The project could not be updated" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error updating the porject",
      });
    });
});

// remove a project
router.delete("/:id", (req, res) => {
  Projects.remove(req.params.id).then((count) => {
    if (count > 0) {
      res.status(200).json({ message: "That project gone" });
    } else {
      res.status(404).json({ message: "Where that project be?" });
    }
  });
});

// get ProjectActions
router.get("/:id/actions", (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then((project) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: "No action to be got" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error getting the action" });
    });
});

router.post(
  "/:id/actions",
  validateProject,
  validateAction,
  (req, res, next) => {
    // do your magic!
    const actionInfo = { ...req.body, project_id: req.params.id };

    Actions.insert(actionInfo)
      .then((post) => {
        res.status(210).json(post);
      })
      .catch((error) => {
        // log error to server
        console.log(error);
        res.status(500).json({
          message: "Error actioning",
        });
      });
  }
);
function validateProject(req, res, next) {
  // do your magic!
  const project = req.body;
  !project || project === {}
    ? res.status(400).json({ message: "missing project data" })
    : next();
}
function validateAction(req, res, next) {
  // do your magic!
  const action = req.body;
  !action || action === {}
    ? res.status(400).json({ message: "missing action data" })
    : next();
}
module.exports = router;
