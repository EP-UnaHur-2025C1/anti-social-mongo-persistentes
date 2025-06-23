// src/swagger/swagger.js
const YAML = require('yamljs');

const users = YAML.load('./swagger/user.yml');
const posts = YAML.load('./swagger/post.yml');
const postImages = YAML.load('./swagger/post_images.yml');
const comments = YAML.load('./swagger/comment.yml');
const tags = YAML.load('./swagger/tag.yml');

const fullSpec = {
  ...posts,
  paths: {
    ...users.paths,
    ...posts.paths,
    ...postImages.paths,
    ...comments.paths,
    ...tags.paths,
  },
  components: {
    schemas: {
      ...users.components.schemas,
      ...posts.components.schemas,
      ...postImages.components.schemas,
      ...comments.components.schemas,
      ...tags.components.schemas,
    }
  }
};

module.exports = fullSpec;
