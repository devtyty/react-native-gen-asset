export interface IAsset {
  pathDir: string;
  assetName: string;
}

export interface IAssetConfig {
  assets: IAsset[];
}

export interface IOuputAsset {
  genFilePath: string;
  fileDataContent: string;
}
