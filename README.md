# react-native-gen-asset

A lightweight JavaScript tool to generate centralized boilerplate for assets (images, lotties, etc.) in React Native projects.

`react-native-gen-asset` scans your asset folders and automatically generates typed, centralized exports so you can import assets consistently and safely across your app.

Built with Bun for fast execution ⚡

## ✨ Features

- 📁 Centralize images, lotties, icons in one place
- 🔁 Auto-generate asset mapping files
- ⚡️ Preview assets with markdown support by vscode
- 🧩 Easy configuration via `asset.config.json`
- 🚀 Fast execution using Bun
- ⚛️ Designed for React Native

## 📦 Installation

```bash
bun add -D react-native-gen-asset
```

Or with npm / yarn:

```bash
npm install -D react-native-gen-asset
# or
yarn add -D react-native-gen-asset
```

## 🛠️ Setup

### 1️⃣ Create config file

At the root of your React Native project, create:

```text
asset.config.json
```

Example configuration:

```json
{
  "assets": [
    { "pathDir": "/assets/images", "assetName": "images" },
    { "pathDir": "/assets/lotties", "assetName": "lotties" }
  ]
}
```

**Config options**

| Field       | Type     | Description                       |
| :---------- | -------- | --------------------------------- |
| `pathDir`   | `string` | Relative path to asset directory  |
| `assetName` | `string` | Name of the exported asset object |

### 2️⃣ Project structure example

```md
project-root
├── assets
│ ├── images
│ │ ├── logo.png
│ │ └── avatar.jpg
│ └── lotties
│ └── loading.json
├── asset.config.json
├── package.json
```

### ▶️ Generate assets

```bash
bunx react-native-gen-asset
```

Or add a script:

```json
{
  "scripts": {
    "gen:assets": "react-native-gen-asset"
  }
}
```

Then run:

```bash
bun run gen:assets
```

### 📄 Generated output (example)

```ts
// assets/images/index.ts
export const images = {
  logo: require("../assets/images/logo.png"),
  avatar: require("../assets/images/avatar.jpg"),
};
```

## 📌 Usage in React Native

```tsx
import { images } from '@/generated/assets/images';
import { lotties } from '@/generated/assets/lotties';

<Image source={images.logo} />

<LottieView source={lotties.loading} autoPlay />
```
