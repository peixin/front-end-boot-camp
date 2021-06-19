module.exports = (api) => {
  const presets = [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: "3",
        targets: api.caller((caller) => caller && caller.target === "node")
          ? { node: "current" }
          : { chrome: "91", esmodules: true },
      },
    ],
  ];
  const plugins = [
    ["@babel/plugin-transform-react-jsx", { pragma: "createElement" }],
  ];

  return {
    presets,
    plugins,
  };
};
