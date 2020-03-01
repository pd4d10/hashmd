module.exports = {
  rollup(config, options) {
    config.external = id => false;
    return config;
  },
};
