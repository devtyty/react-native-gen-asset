#!/usr/bin/env bun

import type { IAsset, IAssetConfig, IAssetItem, IOuputAsset } from "./types";
export * from "./types";

import { readdir } from "node:fs/promises";

const configFileName = "asset.config.json";

const FILE_SUPPORORTED = [
  "svg",
  "png",
  "apng",
  "jpg",
  "jpeg",
  "webp",
  "json",
  "riv",
] as const;

type ExtType = (typeof FILE_SUPPORORTED)[number];

const REGEX_EXTENSION_ASSET = RegExp(
  `\.(${FILE_SUPPORORTED.join("|")})$`,
  "gm",
);

enum FileType {
  SVG = "svg",
  PNG = "png",
  JPG = "JPG",
  JPEG = "jpeg",
  WEBP = "webp",
  JSON = "json",
  RIVE = "riv",
}

// main entry
(async function main() {
  const configFile = Bun.file(configFileName);
  const content: IAssetConfig = await configFile.json();

  // handle format declaration files
  const results = await Promise.all(
    content.assets.map((asset) => processFolderAsset(asset)),
  );

  // create file generating
  await Promise.all(
    results.map((item) => {
      if (item.fileDataContent !== "") {
        const newFile = Bun.file(item.genFilePath);
        return newFile.write(item.fileDataContent);
      }

      return Promise.resolve();
    }),
  );
})();

async function processFolderAsset(asset: IAsset): Promise<IOuputAsset> {
  const pathDir = asset.pathDir;

  const fullPath = process.cwd() + pathDir;

  let fileDataContent = "";

  const filesName = await readdir(fullPath);

  for (const index in filesName) {
    const file = filesName[index];

    if (!file) {
      continue;
    }

    /// ignore scale up files @2x, @3x
    if (/@[\d,.]+x/gm.test(file)) {
      continue;
    }

    /// validate file's extension supported
    if (!REGEX_EXTENSION_ASSET.test(file)) {
      continue;
    }

    const newData: IAssetItem<ExtType> = {
      path: file,
      name: Utils.capitalize(file.replace(REGEX_EXTENSION_ASSET, "")),
    };

    /// set record to export
    fileDataContent += `
  /** How it display
    *
    * ![${newData.name}](${fullPath + "/" + newData.path})
    * */
  ${
    newData.name[0]!.toLowerCase() + newData.name.slice(1, newData.name.length)
  }: require("./${newData.path}"),`;
  }

  fileDataContent = `export const ${asset.assetName} = {${fileDataContent}\n};

export type ${Utils.capitalize(
    [asset.assetName, "type"].join(" "),
  )} = keyof typeof ${asset.assetName};\n`;

  return {
    fileDataContent: fileDataContent,
    genFilePath: fullPath + "/index.ts",
  };
}

const Utils = {
  capitalize(text: string) {
    const arraySplitString = text.trim().split(/[-_\s]/);
    return arraySplitString.reduce((pre, next) => {
      return pre + next.slice(0, 1).toUpperCase() + next.slice(1, next.length);
    }, "");
  },
};
