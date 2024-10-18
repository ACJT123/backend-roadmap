const notes = require("../model/notes");
const fs = require("fs");

/**
 *
 * @param {string} id
 */
const handleDelete = (id) => {
  // remove the note from the notes collection
  notes.remove(id);

  // delete the file from the uploads folder
  fs.unlink(`./uploads/${id}.md`, (err) => {
    if (err) {
      console.log("Error deleting the file", err);
    }
  });
};

module.exports = handleDelete;
