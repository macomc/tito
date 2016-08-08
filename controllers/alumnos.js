
exports.findAll = function(req, res) {
  var results = [];
  var iTotalDisplayRecords = 0;
  var aaData = [];
  var iTotalRecords = 0;
  req.pg.connect(req.db_string_con, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

      var filteredQuery = "SELECT count(*) as num " +
        " FROM alumnos ";
            var queryString = "SELECT codigo , coalesce(name, '') as name ,coalesce(carnet,'') as carnet ," +
                    "coalesce(email,'') as email, coalesce(telefono,'') as telefono " +
                    " from alumnos ";
					/*
      if ( typeof req.query.search !== "undefined") {
		  console.log("VALUE: "+req.query.search.value.toUpperCase());
        queryString += "where upper(name) like %%"+req.query.search.value.toUpperCase()+" ";
        filteredQuery += " where upper(name) like %%"+req.query.search.value.toUpperCase()+" ";
      } 
	  */
      var orderColumn = " codigo ";
      if (typeof req.query.search !== "undefined" && req.query.order.column == 1) {
        orderColumn = "codigo ";
      }
      queryString += " order by " + orderColumn ;
      if (typeof req.query.order !== "undefined")  {
        queryString += " " + req.query.order[0].dir + " ";
      }
      if (typeof req.query.length !== "undefined") {
        queryString += " limit " + req.query.length;
      }
      if (typeof req.query.start !== "undefined") {
        queryString += " offset " + req.query.start;
      }
      // SQL Query > Select Data
      var queryCount = client.query("select count(*) as num from alumnos ");
      var queryFilteredCount = client.query(filteredQuery);
      var query = client.query(queryString);

      //HANDLE ERRORS
      query.on('error', function() {
        done();
        return res.sendStatus(500);
      });

      // Stream results back one row at a time
      queryCount.on('row', function(row1) {
        iTotalRecords = row1.num;
        queryFilteredCount.on('row', function(row2) {
          iTotalDisplayRecords = row2.num;
          query.on('row', function(row) {
            results.push(row);
          });
        });
      });
      // After all data is returned, close connection and return results
      query.on('end', function() {
        done();
        console.log("iTotalDisplayRedcords: "+iTotalDisplayRecords);
        console.log("iTotalRedcords: "+iTotalRecords);
        aaData = {"iTotalRecords": iTotalRecords,"iTotalDisplayRecords": iTotalDisplayRecords,"data":results};
        return res.json(aaData);
      });
    });
};

exports.findById = function(req, res) {
  var results = [];
  var id = req.params.id.substring(1,req.params.id.length);
  //var id = req.params.id;
  console.log("findbyid "+id);
  req.pg.connect(req.db_string_con, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Select Data
    var query = client.query("SELECT * " +
      " FROM alumnos where codigo=($1)",[id]);

    //HANDLE ERRORS
    query.on('error', function() {
		console.log("Entro a error ");
      done();
      return res.sendStatus(500);
    });

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
};

exports.add = function(req, res) {
	req.pg.connect(req.db_string_con, function(err, client, done) {
		// Handle connection errors
		if (err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}
		console.log("ENTRO A ADD ANTES DE QUERY");
		console.log(req.body);
			client.query("INSERT INTO alumnos(name, carnet, email, telefono)"+
				"values($1, $2, $3, $4)",
				[ req.body.name, req.body.carnet, req.body.email, req.body.telefono], function(err, result) {
				if (err) {
		console.log("error");
					console.log(err);
					return res.status(500).json({success: false, data: err});
				} else {
					console.log("done");
					done();
				}
			});
		return res.sendStatus(200);
  });
};

exports.update = function(req, res) {
	req.pg.connect(req.db_string_con, function(err, client, done) {
		// Handle connection errors
		if(err) {
			done();
			console.log(err);
			return res.status(500).send(json({ success: false, data: err}));
		}
		// SQL Query > Update Data after getting the user
		client.query("UPDATE alumnos SET name=($1), carnet=($2), email=($3), telefono=($4) WHERE codigo=($5)",
			[req.body.name, req.body.carnet, req.body.email, req.body.telefono, req.params.id], function(err, result) {
			if (err) {
				console.log(err);
				return res.status(500).json({success: false, data: err});
			} else {
				done();
			}
		});
		return res.sendStatus(200);
	});
};

exports.delete = function(req, res) {
	req.pg.connect(req.db_string_con, function(err, client, done) {
		// Handle connection errors
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({ success: false, data: err});
		}

		// SQL Query > Delete Data
		client.query("DELETE FROM alumnos WHERE codigo=($1)", [req.params.id], function(err, result) {
			if (err) {
				console.log(err);
				return res.status(500).json({success: false, data: err});
			} else {
				done();
			}
		});
		return res.status(200);
	});
};


exports.findByCarnet = function(req, res) {
  var results = [];
  console.log("find by carnet")
  //var carnet = req.params.id.substring(1,req.params.id.length);
  var id = req.params.id;
  console.log("findbycarnet "+id);
  req.pg.connect(req.db_string_con, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Select Data
    var query = client.query("SELECT * " +
      " FROM alumnos where carnet=($1)",[id]);

    //HANDLE ERRORS
    query.on('error', function() {
		console.log("Entro a error ");
      done();
      return res.sendStatus(500);
    });

    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
};
