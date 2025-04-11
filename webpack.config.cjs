const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/main.ts", // Entry point of your application
  target: "node", // Target environment (Node.js)
  externals: [nodeExternals()], // Exclude node_modules from the bundle
  mode: "production", // Set mode to production or development
  module: {
    rules: [
      {
        test: /\.ts$/, // Match TypeScript files
        use: "ts-loader", // Use ts-loader to compile TypeScript
        exclude: /node_modules/, // Exclude node_modules
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve .ts and .js files
    alias: {
      "@helper": path.resolve(__dirname, "src/helper"), // Map @helper to src/helper
    },
  },
  output: {
    filename: "bundle.cjs", // Output file name
    path: path.resolve(__dirname, "dist"), // Output directory
    library: {
      type: "commonjs2", // Output as an ES module
    },
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /src/, // Match the directory containing your routes
      /\.ts$/ // Match only TypeScript files
    ),
  ],
};
