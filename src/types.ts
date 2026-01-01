const FILE_SUPPORTED = [
  "svg",
  "png",
  "apng",
  "jpg",
  "jpeg",
  "webp",
  "json",
  "riv",
] as const;

export type ExtType = (typeof FILE_SUPPORTED)[number];

export const REGEX_EXTENSION_ASSET = RegExp(
  `\.(${FILE_SUPPORTED.join("|")})$`,
  "gm"
);

export interface IAsset {
  pathDir: string;
  assetName: string;

  // /**
  //  * Optional support for web application with TS/JS ecosystem
  //  *
  //  * @value `true` will not apply `require` command for code gen
  //  * @default false
  //  */
  // webSupport?: boolean;

  /**
   * Optional support for SVG transform in react native with babel
   */
  useSvgTransform?: boolean;

  platform?: PlatformSupportType;

  /**
   * Optional output file path for generated asset file
   */
  outputFile?: string;
}

export interface IAssetConfig {
  assets: IAsset[];
}

export interface IOutputAsset {
  genFilePath: string;
  fileDataContent: string;
}

export interface IAssetItem<Ext> {
  fileRelativePath: string;
  filePath: string;
  assetName: string;
  fileExt: Ext;
}

export type PlatformSupportType = "native" | "web";
