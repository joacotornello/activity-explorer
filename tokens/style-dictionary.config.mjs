export default {
  source: ['tokens/src/base/**/*.json', 'tokens/src/semantic/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/shared/styles/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
          },
        },
      ],
    },
  },
};
