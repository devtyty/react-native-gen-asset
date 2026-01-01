#!/usr/bin/env bun

import { REGEX_EXTENSION_ASSET, type IAsset, type IAssetConfig } from "./types";
export * from "./types";

import { readdir } from "node:fs/promises";

const configFileName = "asset.config.json";

const Utils = {
  capitalize(text: string) {
    const arraySplitString = text.trim().split(/[-_\s]/);
    return arraySplitString.reduce((pre, next) => {
      return pre + next.slice(0, 1).toUpperCase() + next.slice(1, next.length);
    }, "");
  },
  camelCase(text: string) {
    const capitalized = this.capitalize(text);
    return (
      capitalized.slice(0, 1).toLowerCase() + capitalized.slice(1, text.length)
    );
  },
  isValidFileExtension(fileName: string): boolean {
    /// ignore scale up files @2x, @3x
    if (/@[\d,.]+x/gm.test(fileName)) {
      return false;
    }

    /// validate file's extension supported
    return REGEX_EXTENSION_ASSET.test(fileName);
  },

  processItemContent(
    asset: IAsset,
    relativeFileName: string,
    fullPath: string
  ): string | undefined {
    if (!relativeFileName || !Utils.isValidFileExtension(relativeFileName)) {
      return;
    }

    const capitalizeAssetName = Utils.capitalize(
      relativeFileName.replace(REGEX_EXTENSION_ASSET, "")
    );

    switch (asset.platform) {
      case "web":
        return `\n/** How it display\n*\n* ![${capitalizeAssetName}](${
          fullPath + "/" + relativeFileName
        })*\n*/\n${Utils.camelCase(capitalizeAssetName)}: "${
          asset.pathDir
        }/${relativeFileName}"`;

      case "native":
      default:
        return `\n/** How it display\n*\n* ![${capitalizeAssetName}](${
          fullPath + "/" + relativeFileName
        })*\n*/\n${Utils.camelCase(
          capitalizeAssetName
        )}: require("./${relativeFileName}")`;
    }
  },

  async processFolderAsset(asset: IAsset) {
    const fullPath = process.cwd() + asset.pathDir;

    const filesName = await readdir(fullPath);

    const contentItems = filesName
      .map((relativeFileName) =>
        Utils.processItemContent(asset, relativeFileName, fullPath)
      )
      .filter((item) => !!item) as string[];

    const contentFilesGrouped = contentItems.join(",\n");

    const output = `export const ${
      asset.assetName
    } = {${contentFilesGrouped}\n};\n\nexport type ${Utils.capitalize(
      [asset.assetName, "type"].join(" ")
    )} = keyof typeof ${asset.assetName};\n`;

    const outputFile = asset.outputFile ?? fullPath + "/index.ts";

    const newFile = Bun.file(outputFile);
    return newFile.write(output);
  },

  async processSvgTransformAsset(asset: IAsset) {
    const fullPath = process.cwd() + asset.pathDir;

    let stringifyExport = `import type { SvgProps } from "react-native-svg";\n`;

    const filesName: Array<{ path: string; name: string }> = [];

    const files = await readdir(fullPath);

    /// Read list svg files
    files.forEach((file) => {
      const regexSplitDot = RegExp(/^(.+?)\./gm);

      const test = regexSplitDot.exec(file.trim());

      if (test !== null && test[1] && test[1] !== "index") {
        filesName.push({ path: file, name: Utils.capitalize(test[1]) });
      }
    });
    filesName.forEach((file, index) => {
      stringifyExport += `${index === 0 ? "" : "\n"}
/** How it display
 *
 * ![${file.name}](${fullPath}/${file.path})
 * */
export const ${file.name}: React.FC<SvgProps> = function ${file.name}(props) {
  return require("./${file.path}").default(props);
}`;
    });

    if (stringifyExport !== "") {
      const newFile = Bun.file(fullPath + "/index.ts");
      return newFile.write(stringifyExport);
    }
  },
};

(async function main() {
  // main process
  const configFile = Bun.file(configFileName);
  const content: IAssetConfig = await configFile.json();

  // create file generating
  content.assets.forEach((asset: IAsset) => {
    if (asset.useSvgTransform) {
      return Utils.processSvgTransformAsset(asset);
    }

    return Utils.processFolderAsset(asset);
  });
})();
