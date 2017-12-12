const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blog} = require('./models');

// we're going to add some blogs
// so there's some data to look at
Blog.create('Trip to Philly', 'I arrive on December 25', 'Laura Jodz', '12-12-2017');
Blog.create('Trip to Cape Rey', 'We travelled here for Ken\'s birthday', 'Laura Jodz', '12-12-2017');
Blog.create('Trip to Texas', 'Ken leaves on December 19', 'Laura Jodz', '12-11-2017');

// when the root of this router is called with GET, return
// all current Blog entrys
router.get('/blog-posts', (req, res) => {
  res.json(Blog.get());
});


// when a new Blog entry is posted, make sure it's
// got required fields. if not, log an error and
// return a 400 status code. if okay,
// add new entry to Blog and return it with a 201.
router.post('/blog-posts', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `\`${field}\` is required`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const entry = Blog.create(req.body.title, req.body.content, req.body.author, req.body.date);
  res.status(201).json(entry);
});


// when DELETE request comes in with an id in path,
// delete that item from Blog.
router.delete('/blog-posts/:id', (req, res) => {
  Blog.delete(req.params.id);
  console.log(`Deleted Blog entry \`${req.params.id}\``);
  res.status(204).end();
});

// when PUT request comes in with updated entry, ensure has
// required fields. also ensure that entry id in url path, and
// entry id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `Blog.update` with updated entry.
router.put('/blog-posts/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `\`${field}\` is required`
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
  const updatedEntry = Blog.update({
    title: req.params.id,
    content: req.body.name,
    author: req.body.budget,
    date: req.body.date
  });
  res.status(204).end();
})

module.exports = router;
