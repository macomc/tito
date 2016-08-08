var express = require('express');
var router = express.Router();
var alumnos = require('../controllers/alumnos');
var conferencias = require('../controllers/conferencias');
var asistencias = require('../controllers/asistencias');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TITO' });
});

  // ALUMNOS
  //
  // index
  router.get('/alumnos', function(req, res, next) {
    res.render('alumnos');
  });
// show
  router.get('/alumno/:id', function(req, res, next) {
    res.render('alumno');
  });
  // new/edit
  router.get('/alumno', function(req, res, next) {
    res.render('alumno');
  });
  // API calls to fill data
  router.get('/api/v1/alumnos', alumnos.findAll);
  router.get('/api/v1/alumnos/:id', alumnos.findById);
  router.post('/api/v1/alumnos', alumnos.add);
  router.put('/api/v1/alumnos/:id', alumnos.update);
  router.delete('/api/v1/alumnos/:id', alumnos.delete);
  router.get('/api/v1/alumnos-carnet/:id', alumnos.findByCarnet);
  
  // CONFERENCIAS
  //
  // index
  router.get('/conferencias', function(req, res, next) {
    res.render('conferencias');
  });
// show
  router.get('/conferencia/:id', function(req, res, next) {
    res.render('conferencia');
  });
  // new/edit
  router.get('/conferencia', function(req, res, next) {
    res.render('conferencia');
  });
  // API calls to fill data
  router.get('/api/v1/conferencias', conferencias.findAll);
  router.get('/api/v1/conferencias/:id', conferencias.findById);
  router.post('/api/v1/conferencias', conferencias.add);
  router.put('/api/v1/conferencias/:id', conferencias.update);
  router.delete('/api/v1/conferencias/:id', conferencias.delete);
  
  
  // new/edit
    router.post('/api/v1/asistencia', asistencias.add);
    
  router.get('/asistencia', function(req, res, next) {
    res.render('asistencia');
  });

// ASISTENCIAS
  //
  // index
  router.get('/asistencias', function(req, res, next) {
    res.render('asistencias');
  });
// show
  router.get('/asistencia/:id', function(req, res, next) {
    res.render('asistencia');
  });
  // new/edit
  router.get('/asistencia', function(req, res, next) {
    res.render('asistencia');
  });
  // API calls to fill data
  router.get('/api/v1/asistencias', asistencias.findAll);
  router.get('/api/v1/asistencias/:id', asistencias.findById);
  router.post('/api/v1/asistencias', asistencias.add);
  router.put('/api/v1/asistencias/:id', asistencias.update);
  router.delete('/api/v1/asistencias/:id', asistencias.delete);
  
module.exports = router;
