export interface IAsset {
  pathDir: string;
  assetName: string;

  /**
   * Optional support for web application with TS/JS ecosystem
   *
   * @value `true` will not apply `require` command for code gen
   * @default false
   */
  webSupport?: boolean;
}

export interface IAssetConfig {
  assets: IAsset[];
}

export interface IOuputAsset {
  genFilePath: string;
  fileDataContent: string;
}

export interface IAssetItem<Ext> {
  fileRelativePath: string;
  filePath: string;
  assetName: string;
  fileExt: Ext;
}
