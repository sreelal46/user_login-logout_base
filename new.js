const fs = require("fs");
const path = require("path");

fs.writeFile("text.txt", "sreelal", (err) => {
  if (err) console.log(err);
});

fs.unlink("./text.txt", (err) => {
  if (err) console.log(err);
});
