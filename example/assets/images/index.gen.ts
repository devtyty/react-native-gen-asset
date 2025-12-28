export const images = {
  /** How it display
   *
   * ![Icon](/Users/lap15325/Documents/megabee/react-native-gen-asset/example/assets/images)
   * */
  icon: require("./icon.png"),
  /** How it display
   *
   * ![PartialReactLogo](/Users/lap15325/Documents/megabee/react-native-gen-asset/example/assets/images)
   * */
  partialReactLogo: require("./partial-react-logo.png"),
  /** How it display
   *
   * ![AndroidIconBackground](/Users/lap15325/Documents/megabee/react-native-gen-asset/example/assets/images)
   * */
  androidIconBackground: require("./android-icon-background.png"),
  /** How it display
   *
   * ![Favicon](/Users/lap15325/Documents/megabee/react-native-gen-asset/example/assets/images)
   * */
  favicon: require("./favicon.png"),
  /** How it display
   *
   * ![AndroidIconForeground](/Users/lap15325/Documents/megabee/react-native-gen-asset/example/assets/images)
   * */
  androidIconForeground: require("./android-icon-foreground.png"),
  /** How it display
   *
   * ![ReactLogo](/Users/lap15325/Documents/megabee/react-native-gen-asset/example/assets/images)
   * */
  reactLogo: require("./react-logo.png"),
  /** How it display
   *
   * ![AndroidIconMonochrome](/Users/lap15325/Documents/megabee/react-native-gen-asset/example/assets/images)
   * */
  androidIconMonochrome: require("./android-icon-monochrome.png"),
  /** How it display
   *
   * ![SplashIcon](/Users/lap15325/Documents/megabee/react-native-gen-asset/example/assets/images)
   * */
  splashIcon: require("./splash-icon.png"),
} as const;

export type ImagesType = keyof typeof images;
