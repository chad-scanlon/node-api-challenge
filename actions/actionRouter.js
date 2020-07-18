const express = require("express");
const router = express.Router();

const Actions = require("../data/helpers/actionModel");

// get actions
router.get("/", (req, res) => {
  Actions.get(req.query)
    .then((action) => {
      res.status(200).json(action);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error retrieving the action",
      });
    });
});

// get a specific action
router.get("/:id", validateActionId, (req, res) => {
  Actions.get(req.params.id)
    .then((action) => {
      if (action) {
        res.status(200).json(action);
      } else {
        res.status(404).json({ message: "Action not found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the action",
      });
    });
});

// add an action
// router.post("/:id", validateActionId, (req, res, next) => {
//   const changes = req.body;
//   Actions.insert(req.params.id, changes)
//     .then((action) => {
//       console.log(action);
//       res.status(201).json(action);
//     })
//     .catch((error) => {
//       // log error to database
//       console.log(error);
//       res.status(500).json({
//         message: "Error adding the action",
//       });
//     });
// });

// delete an action
router.delete("/:id", (req, res) => {
  Actions.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The action has been sent away" });
      } else {
        res.status(404).json({ message: "The action could not be found" });
      }
    })
    .catch((error) => {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: "Error removing the action",
      });
    });
});

router.put("/:id", validateActionId, (req, res, next) => {
  const changes = req.body;
  Actions.update(req.params.id, changes)
    .then((action) => {
      if (action) {
        res.status(200).json(action);
      } else {
        res.status(404).json({ message: "The action could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the action",
      });
    });
});

function validateActionId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Actions.get(id)
    .then((action) => {
      if (action) {
        req.action = action;
        next();
      } else {
        // res.status(404).json({ message: 'does not exist' });
        next(new Error("does not exist"));
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: "invalid action id", err });
    });
}
function validateAction(req, res, next) {
  // do your magic!
  const action = req.body;
  !action || action === {}
    ? res.status(400).json({ message: "missing action data" })
    : next();
}
module.exports = router;
