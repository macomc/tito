var express = require('express');
var router = express.Router();
var alumnos = require('../controllers/alumnos');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TITO' });
});

  // CONTACTS
  //
  // index
  router.get('/alumnos', function(req, res, next) {
    res.render('alumnos');
  });
// API calls to fill data
  router.get('/api/v1/alumnos', alumnos.findAll);
  router.get('/api/v1/alumnos/:id', alumnos.findById);
  router.post('/api/v1/alumnos', alumnos.add);
  router.put('/api/v1/alumnos/:id', alumnos.update);
  router.delete('/api/v1/alumnos/:id', alumnos.delete);

module.exports = router;
