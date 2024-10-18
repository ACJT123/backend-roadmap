const notes = require("../model/notes");
const fs = require("fs");

/**
 *
 * @param {string} fileId
 */
const checkGrammar = async (fileId) => {
  // Get file by id
  const file = notes.list().find((n) => n.id === fileId);

  if (!file) {
    throw new Error("File not found");
  }

  // Read the file content
  const fileContent = fs.readFileSync(`./uploads/${file.id}.md`, "utf8");

  // Check grammar using LanguageTool API
  const params = new URLSearchParams();
  params.append("language", "en-US");
  params.append("text", fileContent);

  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = await response.json();

  // Correct the text
  let correctedText = fileContent;

  data.matches.forEach((match) => {
    const { offset, length } = match;
    const replacement = match.replacements[0].value;

    correctedText =
      correctedText.substring(0, offset) +
      replacement +
      correctedText.substring(offset + length);
  });

  // Save the corrected text to a new file
  const filePath = `./uploads/${file.id}.md`;
  fs.writeFileSync(filePath, correctedText, "utf-8");
};

module.exports = checkGrammar;
