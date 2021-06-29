let path = require("path");
let { readdir } = require("fs");
let { spawn, exec } = require("child_process");

let appPath = path.join(__dirname, "../app");
let routesPath = path.join(appPath, "routes");
let stylesPath = path.join(appPath, "styles");

function createTailwindArgs(input, output, purgePath) {
  let base = ["-i", input, "-o", output, `--purge="${purgePath}"`, "--jit"];
  if (process.env.NODE_ENV === "development") {
    base.push("--watch");
  } else {
    base.push("--minify");
  }

  return base;
}

function spawnTailwind(pathName) {
  // remove the filename
  cssPathName = `${
    pathName.substr(0, pathName.lastIndexOf(".")) || pathName
  }.css`;

  let tw = spawn(
    "tailwindcss",
    createTailwindArgs(
      `${stylesPath}/tailwind/route.css`,
      `"${stylesPath}/routes/${cssPathName}"`,
      `${routesPath}/${pathName}`
    ),
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
    createTailwindArgs(
      `${stylesPath}/tailwind/base.css`,
      `${stylesPath}/root.css`,
      `${appPath}/root.tsx`
    ),
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
