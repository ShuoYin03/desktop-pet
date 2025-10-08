module.exports = {
  root: true,
  extends: ['../../config/eslint.base.cjs'],
  parserOptions: {
    project: ['./tsconfig.renderer.json']
  },
  env: {
    browser: true,
    node: true
  }
};
