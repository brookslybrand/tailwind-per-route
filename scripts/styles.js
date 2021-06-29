let path = require("path");
let { readdir } = require("fs");
let { spawn, exec } = require("child_process");

let appPath = path.join(__dirname, "../app");
let routesPath = path.join(appPath, "routes");
let stylesPath = path.join(appPath, "styles");

function spawnTailwind(pathName) {
  // remove the filename
  cssPathName = `${
    pathName.substr(0, pathName.lastIndexOf(".")) || pathName
  }.css`;

  let tw = spawn(
    "tailwindcss",
    [
      "-i",
      `${stylesPath}/tailwind/route.css`,
      "-o",
      `"${stylesPath}/${cssPathName}"`,
      "-w",
      `--purge="${routesPath}/${pathName}"`,
      "--jit",
    ],
    { shell: true }
  );

  tw.stdout.on("data", (data) => {
    console.log(data);
  });
  tw.stderr.on("data", (data) => {
    // console.error(String(data));
  });
  tw.on("error", (error) => {
    console.error(error.message);
  });
  tw.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
  return tw;
}

spawnBaseStyles();
spawnFilesInDirectory();

function spawnFilesInDirectory(directoryPath = routesPath) {
  readdir(directoryPath, { withFileTypes: true }, (err, files) => {
    for (let file of files) {
      if (file.isDirectory()) {
        spawnFilesInDirectory(`${directoryPath}/${file.name}`);
      } else {
        // find the relative path of the route from the base of the routes path
        // removing the first / if one exists and escaping all dollar signs
        let root = directoryPath.replace(routesPath, "");
        let pathName = `${root}/${file.name}`
          .replace("/", "")
          .replace(/\$/g, "\\$");
        spawnTailwind(pathName);
      }
    }
  });
}

function spawnBaseStyles() {
  let tw = spawn(
    "tailwindcss",
    [
      "-i",
      `${stylesPath}/tailwind/base.css`,
      "-o",
      `${stylesPath}/root.css`,
      "-w",
      `--purge="${appPath}/root.tsx"`,
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
