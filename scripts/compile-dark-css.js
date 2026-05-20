const fs = require("fs");
const path = require("path");
const stylus = require("stylus");

const pkgDir = "/root/Hydro/packages/ui-default";

// Resolve ~vj webpack alias
function resolveVjImports(src) {
  return src.replace(/@import\s+['"]~vj\/([^'"]+)['"]/g, (_, p) =>
    `@import '${path.join(pkgDir, p)}'`
  );
}

const commonInc = path.join(pkgDir, "common", "common.inc.styl");
const darkStyl = path.join(pkgDir, "theme", "dark.styl");

let commonSrc = fs.readFileSync(commonInc, "utf8");
commonSrc = resolveVjImports(commonSrc);

const combinedSrc = commonSrc + "\n" + fs.readFileSync(darkStyl, "utf8");

stylus(combinedSrc)
  .set("filename", commonInc)
  .use(require("rupture")())
  .render((err, css) => {
    if (err) {
      console.error("STYLUS ERROR:", err.message);
      process.exit(1);
    }
    const outPath = path.join(pkgDir, "public", "theme-4.58.1.css");
    fs.writeFileSync(outPath, css);
    console.log("OK: compiled dark theme CSS ->", outPath, "(" + css.length + " bytes)");
  });
