import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSwaggerDirs(rootDir) {
  const pattern = path.join(rootDir, '**/swagger').replace(/\\/g, '/');
  let swaggerDirs = glob.sync(pattern);
  return swaggerDirs;
}

function getYamlFiles(dir) {
  const pattern = path.join(dir, '**/*.yaml').replace(/\\/g, '/');
  return glob.sync(pattern);
}

const rootDir = path.join(__dirname).replace(/\\/g, '/');
const swaggerDirs = getSwaggerDirs(rootDir);

let yamlFiles = [];
swaggerDirs.forEach((swaggerDir) => {
  const files = getYamlFiles(swaggerDir);
  yamlFiles = yamlFiles.concat(files);
});

export default {
  info: {
    title: 'boilerplate API Title',
    description: 'boilerplate Description',
    version: '1.0.0',
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: yamlFiles,
};
