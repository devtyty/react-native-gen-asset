export class AssetHelper {
  static capitalize(text: string) {
    const arraySplitString = text.trim().split(/[-_\s]/);

    return arraySplitString.reduce((pre, next) => {
      return pre + next.slice(0, 1).toUpperCase() + next.slice(1, next.length);
    }, "");
  }
}
