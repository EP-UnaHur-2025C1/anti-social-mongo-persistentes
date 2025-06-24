const path = require('path');
const YAML = require('yamljs');

const users = YAML.load(path.join(__dirname, 'user.yml'));
const posts = YAML.load(path.join(__dirname, 'post.yml'));
const postImages = YAML.load(path.join(__dirname, 'post_images.yml'));
const comments = YAML.load(path.join(__dirname, 'comment.yml'));
const tags = YAML.load(path.join(__dirname, 'tag.yml'));

const fullSpec = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0"
  },
  paths: {
    ...users.paths,
    ...posts.paths,
    ...postImages.paths,
    ...comments.paths,
    ...tags.paths
  },
  components: {
    schemas: {
      ...users.components?.schemas,
      ...posts.components?.schemas,
      ...postImages.components?.schemas,
      ...comments.components?.schemas,
      ...tags.components?.schemas
    }
  }
};

module.exports = fullSpec;
