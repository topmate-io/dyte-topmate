// cra-webpack-rewired hook (read by cra-webpack-rewired from config/webpack.extend.js).
//
// The @cloudflare/realtimekit 2.x SDK ships modern class syntax (e.g. `super()`
// inside an arrow function). CRA's node_modules Babel pass
// (babel-preset-react-app/dependencies) runs @babel/plugin-transform-parameters
// but not @babel/plugin-transform-classes, which fails to compile that pattern:
//   "it's not possible to compile `super()` in an arrow function with default or
//    rest parameters without compiling classes."
// Injecting @babel/plugin-transform-classes into every babel-loader resolves it.

const transformClasses = require.resolve('@babel/plugin-transform-classes');

function addPluginToBabelLoader(rule) {
  const loader = rule.loader || '';
  if (typeof loader === 'string' && loader.includes('babel-loader')) {
    rule.options = rule.options || {};
    rule.options.plugins = rule.options.plugins || [];
    if (!rule.options.plugins.includes(transformClasses)) {
      rule.options.plugins.push(transformClasses);
    }
  }
}

function walkRules(rules) {
  if (!Array.isArray(rules)) return;
  rules.forEach((rule) => {
    if (!rule) return;
    if (rule.oneOf) walkRules(rule.oneOf);
    if (Array.isArray(rule.use)) rule.use.forEach(addPluginToBabelLoader);
    addPluginToBabelLoader(rule);
  });
}

function extend(config) {
  walkRules(config.module && config.module.rules);
  return config;
}

module.exports = {
  prod: extend,
  dev: extend,
};
