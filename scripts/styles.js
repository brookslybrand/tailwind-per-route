const path = require("path");
let { readdir } = require("fs");
let { spawn, exec } = require("child_process");

const directoryPath = path.join(__dirname, "app/routes");

function spawnTailwind(pathName) {
  // remove the filename
  cssPathName = `${
    pathName.substr(0, pathName.lastIndexOf(".")) || pathNames
  }.css`;
  let tw = spawn(
    "npx",
    [
      "tailwindcss",
      "-i",
      path.join(__dirname, "app/styles/tailwind/route.css"),
      "-o",
      path.join(__dirname, `app/styles/${cssPathName}`),
      "-w",
      `--purge="${path.join(__dirname, `app/routes/${pathName}`)}"`,
      "--jit",
    ],
    { shell: true }
  );

  tw.stdout.on("data", (data) => {
    console.log(data);
  });
  tw.stderr.on("data", (data) => {
    console.error(String(data));
  });
  tw.on("error", (error) => {
    console.error(error.message);
  });
  tw.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
  return tw;
}

readdir(directoryPath, { withFileTypes: true }, (err, files) => {
  for (let file of files) {
    if (file.isDirectory()) continue;
    spawnTailwind(file.name);
  }
});
