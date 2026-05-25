const common = {
  requireModule: ['ts-node/register'],
  require: [
    'src/utils/world.ts',
    'src/hooks/hooks.ts',
    'src/steps/ui/home.steps.ts',
    'src/steps/ui/login.steps.ts',
    'src/steps/ui/products.steps.ts',
    'src/steps/ui/cart.steps.ts',
    'src/steps/ui/contact.steps.ts',
    'src/steps/ui/advanced.steps.ts',
    'src/steps/api/products-api.steps.ts',
    'src/steps/api/brands-api.steps.ts',
    'src/steps/api/user-lifecycle-api.steps.ts'
  ],
  format: ['progress'],
  formatOptions: { resultsDir: 'allure-results' }
};

module.exports = {
  default: { ...common, timeout: 60000, stepDefinitionSyntax: undefined },
  ui:         { ...common, paths: ['src/features/ui/*.feature'],  tags: '@ui', timeout: 60000 },
  api:        { ...common, paths: ['src/features/api/*.feature'], tags: '@api', timeout: 60000 },
  smoke:      { ...common, paths: ['src/features/*.feature'],     tags: '@smoke', timeout: 60000 },
  regression: { ...common, paths: ['src/features/*.feature'],     tags: '@regression', timeout: 60000 },
  allure: {
    ...common,
    format: ['progress', 'allure-cucumberjs/reporter'],
    paths: ['src/features/**/*.feature'],
    timeout: 60000
  }
};
