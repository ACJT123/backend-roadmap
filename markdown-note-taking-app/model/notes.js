const fs = require("fs");

class Notes {
  constructor() {
    // Read the notes.json file
    const notes = fs.readFileSync("./db/notes.json", "utf8");

    // If the notes.json file is empty, set the notes to an empty array
    if (!this.notes) {
      this.notes = [];
    } else {
      // Parse the notes.json file
      this.notes = JSON.parse(notes);
    }
  }

  add(note) {
    if (!this.isAlreadyAdded(note)) {
      this.notes.push(note);

      // update the notes.json file
      fs.writeFile(
        "./db/notes.json",
        JSON.stringify(this.notes, null, 2),
        (err) => {
          if (err) {
            console.log("Error saving the notes", err);
          }
        }
      );
    }
  }

  isAlreadyAdded(note) {
    return this.notes.some((n) => n.id === note.id);
  }

  list() {
    return this.notes;
  }

  size() {
    return this.notes.length;
  }

  /**
   *
   * @param {string} id
   * @returns {object}
   */
  find(id) {
    return this.notes.find((n) => n.id === id);
  }

  remove(id) {
    const note = this.find(id);
    if (!note) {
      throw new Error("Note not found");
    }

    this.notes = this.notes.filter((n) => n.id !== id);

    // remove the note from the notes collection
    fs.writeFile(
      "./db/notes.json",
      JSON.stringify(this.notes, null, 2),
      (err) => {
        if (err) {
          console.log("Error saving the notes", err);
        }
      }
    );
  }
}

const notes = new Notes();

module.exports = notes;
