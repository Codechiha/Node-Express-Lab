// import your node modules
const express = require('express');

const db = require('./data/db.js');

const server = express();

// add your server code starting here
server.use(express.json());

server.get('/', (req, res) => {
  db.find()
  .then(posts => {
    if (posts){
    res.status(200).json({ posts })
  } else{
    res.status(500).json({ error: "The posts information could not be retrieved." })
  }
  }).catch( err => {
    res.send(err);
  });
});

server.get('/api/posts/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
  .then(post => {
    if (post.length !== 0) {
      res.status(200).json(post);
    } else{
      res.status(404).json({ message: "The post with the specified ID does not exist." });
    }
  })
  .catch( err => res.status(500).json(err))
});

server.post('/api/posts', (req, res) => {
  const post = req.body;
  if (post.title || post.contents){
  db.insert(post)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => res.status(500).json({ error: err }));
  }else {
    res
      .status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
});

server.delete('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(post => {
      if (post) {
        db.remove(id).then(count => {
          res.status(200).json(post)
        })
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => res.stats(500).json(err))
});

server.put('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  const post = db.findById(id);

  db.update(id, changes)
    .then(updated => {
      if(!changes.title || !changes.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
      } else if (!updated){
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(updated);
      }
    })
});

server.listen(5000, () => console.log('server running!'));
