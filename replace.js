var fs = require("fs");
const file = "index.html";
fs.readFile(file, "utf8", (err, data) => {
  const regex = new RegExp("<title>VIM Viewer ?([0-9]*)</title>");
  const matches = data.match(regex);
  const number = Number.parseInt(matches[1]) + 1;
  const result = data.replace(regex, `<title>VIM Viewer ${number}</title>`);
  fs.writeFile(file, result, () => {});
});
