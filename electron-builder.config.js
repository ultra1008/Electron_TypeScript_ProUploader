let config = {
  appId: "photofinale.pro.uploader",
  productName: "PRO Uploader",
  copyright: "Photo Finale, Inc.",
  buildVersion: "",
  extraMetadata: {},
  artifactName: "${productName}-${buildVersion}-${os} Setup.${ext}",
  asar: false,
  includeSubNodeModules: true,
  directories: {
    "app": "app",
    "output": "release"
  },
  extraResources: [
    {
      "filter": [
        "**/*"
      ],
      "from": "dist",
      "to": "app"
    }
  ],
  files: [
    "**/*",
    "!**/*.ts",
    "!*.map",
    "!package.json",
    "!package-lock.json"
  ],
  linux: {
    icon: "./app/icon.ico",
    category: "app.tools",
    target: ["AppImage"]
  },
  mac: {
    icon: "./app/icon.ico",
    target: ["dmg"],
    category: "public.app-category.utilities"
  },
  nsis: {
    allowToChangeInstallationDirectory: false,
    installerIcon: "./app/icon.ico",
    license: "./app/license.md",
    oneClick: true,
    uninstallDisplayName: "PRO Uploader Uninstaller",
    uninstallerIcon: "./app/icon.ico"
  },
  win: {
    icon: "./app/icon.ico",
    target: ["nsis"]
  }
}

config.buildVersion = process.env.npm_package_version;
config.extraMetadata = { version: process.env.npm_package_version };
//console.log(config);

module.exports = config
