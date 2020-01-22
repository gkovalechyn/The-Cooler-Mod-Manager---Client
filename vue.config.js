module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add("./src/Main.ts");
  }
};
