var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
	db.createTable('alumnos', {
		codigo: { type: 'int', primaryKey: true, notNull: true},
		name: { type: 'string'},
		carnet: { type: 'string'},
		email: { type: 'string', notNull: true},
		telefono: { type: 'string'},
		api_key: { type: 'string'}
	}, callback);
	db.createTable('conferencias', {
		codigo: { type: 'int', primaryKey: true, notNull: true},
		name: { type: 'string'}
	}, callback);
	db.createTable('asistencias', {
		codigo: { type: 'int', primaryKey: true, notNull: true},
		codigo_alumno: { type: 'int', notNull: true},
		codigo_conferencia: { type: 'int', notNull: true},
		fecha: { type: 'timestamp'}
	}, callback);
};

exports.down = function(db, callback) {	
	db.dropTable('asistecias', callback);
	db.dropTable('conferencias', callback);
	db.dropTable('alumnos', callback);
};