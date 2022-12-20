#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_util_1 = require("./util/file-util");
var fileContent = "";
let idx = 0;
const config = (0, file_util_1.readConfigFile)();
(0, file_util_1.validateConfigObject)(config);
const fileMatchRegex = new RegExp(config.include);
(0, file_util_1.createDir)(config.outputDir);
let defaultExports = [];
let preservedFilesExpots = [];
(0, file_util_1.readDirectory)(config.target, (file) => {
    idx += 1;
    let varName = "";
    for (let i = 0; i < idx; i++)
        varName += "_";
    const fileRelaitvePath = file.filePath.replace(config.target, ".");
    if (config.preservedFiles && Object.keys(config.preservedFiles).includes(fileRelaitvePath)) {
        fileContent += `const ${varName} = require ("${fileRelaitvePath}");\n`;
        config.preservedFiles[fileRelaitvePath].forEach((prevedExport) => {
            preservedFilesExpots.push(`    ${prevedExport}: ${varName}.${prevedExport}`);
        });
    }
    else if (fileMatchRegex.test(file.fileName)) {
        fileContent += `const ${varName} = require ("${fileRelaitvePath}");\n`;
        defaultExports.push(varName);
    }
});
(0, file_util_1.writeFile)(config.outputDir + "/" + config.outputFile, `${fileContent}
module.exports = { 
    default: [${defaultExports.join(",")}],\n    /* preserved exports */
${preservedFilesExpots.join(",\n")}
};
`);
