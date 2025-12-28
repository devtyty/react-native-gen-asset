#!/usr/bin/env bun

import type { IAssetConfig } from "./types";
import { readdir } from "node:fs/promises";
import { AssetHelper } from "./utils";

const configFileName = "asset.config.json";

const REGEX_EXTENSION_ASSET = /\.(svg|png|apng|jpg|jpeg|webp|json|riv|ttf)$/gm;

async function handleGenAssets() {
  const configFile = Bun.file(configFileName);

  const content: IAssetConfig = await configFile.json();

  for (const assetConfig of content.assets) {
    const pathDir = assetConfig.pathDir;

    const fullPath = process.cwd() + pathDir;

    let stringifyImport = "";

    const filesName = await readdir(fullPath);

    for (const index in filesName) {
      const file = filesName[index];

      if (!file) {
        continue;
      }

      /// ignore files scale up @2x, @3x
      if (/@[\d,.]+x/gm.test(file)) {
        continue;
      }

      /// validate các extension file support
      if (!REGEX_EXTENSION_ASSET.test(file)) {
        continue;
      }

      const newData = {
        path: file,
        name: AssetHelper.capitalize(file.replace(REGEX_EXTENSION_ASSET, "")),
      };

      /// set record to export
      stringifyImport += `
  /** How it display
    *
    * ![${newData.name}](${fullPath + "/" + newData.path})
    * */
  ${
    newData.name[0]!.toLowerCase() + newData.name.slice(1, newData.name.length)
  }: require("./${newData.path}"),`;
    }

    stringifyImport = `export const ${
      assetConfig.assetName
    } = {${stringifyImport}\n};

export type ${AssetHelper.capitalize(
      [assetConfig.assetName, "type"].join(" "),
    )} = keyof typeof ${assetConfig.assetName};\n`;

    if (stringifyImport && stringifyImport !== "") {
      const newFile = Bun.file(fullPath + "/index.ts");
      newFile.write(stringifyImport);
    }
  }
}

handleGenAssets();
