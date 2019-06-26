/* eslint-disable */

/**
 * This script will extract the internationalization messages from all components
   and package them in the translation json files in the translations file.
 */

const fs = require('fs');
const nodeGlob = require('glob');
const transform = require('@babel/core').transform;

const animateProgress = require('./helpers/progress');
const addCheckmark = require('./helpers/checkmark');

/*
const pkg = require('../../package.json');
const presets = pkg.babel.presets;
const plugins = pkg.babel.plugins || [];
*/

const presets = ['next/babel', '@zeit/next-typescript/babel'];
const plugins = [];

const { DEFAULT_LOCALE, APPLOCALES } = require('../settings');

// Glob to match all js files except test files
const FILES_TO_PARSE = 'messages/**/*.ts';
const locales = APPLOCALES;

const newLine = () => process.stdout.write('\n');

// Progress Logger
let progress;
const task = message => {
  progress = animateProgress(message);
  process.stdout.write(message);

  return error => {
    if (error) {
      process.stderr.write(error);
    }
    clearTimeout(progress);
    return addCheckmark(() => newLine());
  };
};

// Wrap async functions below into a promise
const glob = pattern =>
  new Promise((resolve, reject) => {
    nodeGlob(pattern, (error, value) =>
      error ? reject(error) : resolve(value),
    );
  });

const readFile = fileName =>
  new Promise((resolve, reject) => {
    fs.readFile(fileName, (error, value) =>
      error ? reject(error) : resolve(value),
    );
  });

const writeFile = (fileName, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, (error, value) =>
      error ? reject(error) : resolve(value),
    );
  });

// Store existing translations into memory
const oldLocaleMappings = [];
const localeMappings = [];

// Loop to run once per locale
for (const locale of locales) {
  oldLocaleMappings[locale] = {};
  localeMappings[locale] = {};
  // File to store translation messages into
  const translationFileName = `lang/${locale}.json`;
  try {
    // Parse the old translation message JSON files
    const messages = JSON.parse(fs.readFileSync(translationFileName));
    const messageKeys = Object.keys(messages);
    for (const messageKey of messageKeys) {
      oldLocaleMappings[locale][messageKey] = messages[messageKey];
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      process.stderr.write(
        `There was an error loading this translation file: ${translationFileName}
        \n${error}`,
      );
    }
  }
}

/* push `react-intl` plugin to the existing plugins that are already configured in `package.json`
   Example:
   ```
  "babel": {
    "plugins": [
      ["transform-object-rest-spread", { "useBuiltIns": true }]
    ],
    "presets": [
      "env",
      "react"
    ]
  }
  ```
*/
plugins.push(['react-intl']);

const extractFromFile = fileName => {
  return readFile(fileName)
    .then(code => {
      // Use babel plugin to extract instances where react-intl is used
      const { metadata: result } = transform(code, {
        presets,
        plugins,
        filename: fileName,
      });

      for (const message of result['react-intl'].messages) {
        for (const locale of locales) {
          const oldLocaleMapping = oldLocaleMappings[locale][message.id];
          // Merge old translations into the babel extracted instances where react-intl is used
          const newMsg =
            locale === DEFAULT_LOCALE ? message.defaultMessage : '';
          localeMappings[locale][message.id] = oldLocaleMapping
            ? oldLocaleMapping
            : newMsg;
        }
      }
    })
    .catch(error => {
      process.stderr.write(`Error transforming file: ${fileName}\n${error}`);
    });
};

const memoryTask = glob(FILES_TO_PARSE);
const memoryTaskDone = task('Storing language files in memory');

memoryTask.then(files => {
  memoryTaskDone();

  const extractTask = Promise.all(
    files.map(fileName => extractFromFile(fileName)),
  );
  const extractTaskDone = task('Run extraction on all files');
  // Run extraction on all files that match the glob on line 16
  extractTask.then(result => {
    extractTaskDone();

    // Make the directory if it doesn't exist, especially for first run
    //mkdir('-p', 'lang');

    let localeTaskDone;
    let translationFileName;

    for (const locale of locales) {
      translationFileName = `lang/${locale}.json`;
      localeTaskDone = task(
        `Writing translation messages for ${locale} to: ${translationFileName}`,
      );

      // Sort the translation JSON file so that git diffing is easier
      // Otherwise the translation messages will jump around every time we extract
      let messages = {};
      Object.keys(localeMappings[locale])
        .sort()
        .forEach(function(key) {
          messages[key] = localeMappings[locale][key];
        });

      // Write to file the JSON representation of the translation messages
      const prettified = `${JSON.stringify(messages, null, 2)}\n`;

      try {
        fs.writeFileSync(translationFileName, prettified);
        localeTaskDone();
      } catch (error) {
        localeTaskDone(
          `There was an error saving this translation file: ${translationFileName}
          \n${error}`,
        );
      }
    }

    process.exit();
  });
});
