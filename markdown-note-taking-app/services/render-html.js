const fs = require("fs");
const notes = require("../model/notes");
const Showdown = require("showdown");

const renderHtml = (fileId) => {
  const file = notes.list().find((n) => n.id === fileId);

  if (!file) {
    throw new Error("File not found");
  }

  const fileContent = fs.readFileSync(`./uploads/${file.id}.md`, "utf8");

  const converter = new Showdown.Converter();

  return converter.makeHtml(fileContent);
};

module.exports = renderHtml;
