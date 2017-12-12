const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// we're going to add some blogs
// so there's some data to look at
BlogPosts.create('Trip to Philly', 'I arrive on December 25', 'Laura Jodz');
BlogPosts.create('Trip to Cape Rey', 'We travelled here for Ken\'s birthday', 'Laura Jodz');
BlogPosts.create('Trip to Texas', 'Ken leaves on December 19', 'Laura Jodz');

// when the root of this router is called with GET, return
// all current Blog entrys
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});


// when a new Blog entry is posted, make sure it's
// got required fields. if not, log an error and
// return a 400 status code. if okay,
// add new entry to Blog and return it with a 201.
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `\`${field}\` is required`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const entry = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(entry);
});


// when DELETE request comes in with an id in path,
// delete that item from Blog.
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted Blog entry \`${req.params.id}\``);
  res.status(204).end();
});

// when PUT request comes in with updated entry, ensure has
// required fields. also ensure that entry id in url path, and
// entry id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `Blog.update` with updated entry.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `The \`${field}\` is required`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog entry \`${req.params.id}\``);
  const updatedEntry = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
})

module.exports = router;
