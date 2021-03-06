const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe("Blog Posts", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

   it("should list items on GET", function() {
    return chai
      .request(app)
      .get("/blog-posts")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.have.all.keys(
            "id",
            "title",
            "content",
            "author",
            "publishDate"
          );
        });
      });
  });
  it("should add a blog post on POST", function() {
    const newBlog = { title:'Blog about tech', content: 'Lorem Ipsum', author: 'Lorenzo Jim'};
    return chai 
      .request(app)
      .post("/blog-posts")
      .send(newBlog)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.inculde.keys('id', 'title', 'content', 'author',);
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newBlog, { id: res.body.id })
         );
      })
  });

  it("should error if POST missing expected values", function() {
    const badRequestData = {};
    return chai
      .request(app)
      .post("/blog-posts")
      .send(badRequestData)
      .then(function(res) {
        expect(res).to.have.status(400);
      });
  });
  
  it("should update a specified blog post on PUT", function() {
    const updateData = {
      title:'Lorem Ipsum',
      content: 'Lorem Ipsum',
      author: 'jim lore'
    };
    return (
      chai
        .request(app)
        // first have to get so we have an idea of object to update
        .get("/blog-posts")
        .then(function(res) {
          updateData.id = res.body[0].id;
          // this will return a promise whose value will be the response
          // object, which we can inspect in the next `then` block. Note
          // that we could have used a nested callback here instead of
          // returning a promise and chaining with `then`, but we find
          // this approach cleaner and easier to read and reason about.
          return chai
            .request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData);
        })
        // prove that the PUT request has right status code
        // and returns updated item
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
  it("should delete blog post on DELETE", function() {
    return (
      chai
        .request(app)
        // first have to get so we have an `id` of item
        // to delete
        .get("/blog-posts")
        .then(function(res) {
          return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
});
  

