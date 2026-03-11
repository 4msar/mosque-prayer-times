const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === "web" && moduleName === "react-native-maps") {
        return {
            filePath: path.resolve(
                __dirname,
                "src/mocks/react-native-maps.web.tsx",
            ),
            type: "sourceFile",
        };
    }

    if (originalResolveRequest) {
        return originalResolveRequest(context, moduleName, platform);
    }

    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
