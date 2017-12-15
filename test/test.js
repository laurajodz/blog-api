const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {app, closeServer, runServer} = require('../server');

chai.use(chaiHttp);

describe('Blog Posts', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should list all entries on GET', function() {
  return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);
      const expectedKeys = ['title', 'content', 'author'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });
  it('should add an entry on POST', function() {
    const newEntry = {title: 'Trip to Easton', content: 'I leave LA on December 22', author: 'Laura Jodz'};
    const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newEntry));
    return chai.request(app)
      .post('/blog-posts')
      .send(newEntry)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(expectedKeys);
        res.body.title.should.equal(newEntry.title);
        res.body.content.should.equal(newEntry.content);
        res.body.author.should.equal(newEntry.author)
      });
  });
  it('should update an entry on PUT', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      const updatedEntry = Object.assign(res.body[0], {
        title: 'Trip to Philly',
        content: 'I arrive from Easton on December 25'});
      return chai.request(app)
          .put(`/blog-posts/${res.body[0].id}`)
          .send(updatedEntry)
          .then(function(res) {
            res.should.have.status(204);
          });
      });
    });
  it('should delete an entry on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
  it('should throw an error if content is not provided on PUT', function() {
    const updateData = {
      title: 'Trip to Cape Rey'}
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        res.should.have.status(400);
      }).catch(function(err) {
        err.should.have.status(400);
      });
    });
  })
