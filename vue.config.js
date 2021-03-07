module.exports = {
   transpileDependencies: ["vuetify"],
   pluginOptions: {
      electronBuilder: {
         builderOptions: {
            publish: ["github"],
         },
         nodeModulesPath: ["./node_modules"],
         nodeIntegration: true,
      },
   },
   configureWebpack: {
      devtool: "source-map",
   },
};
