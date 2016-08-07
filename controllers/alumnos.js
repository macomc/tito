
exports.findAll = function(req, res) {
  var results = [];
  var iTotalDisplayRecords = 0;
  var aaData = [];
  var iTotalRecords = 0;
  req.pg.connect(req.db_string_con, function(err, client, done) {
    // Handle connection errors
	console.log("DB_STRING_CON"+req.db_string_con);
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
	  console.log(filteredQuery);
	  console.log(queryString);
      // SQL Query > Select Data
      var queryCount = client.query("select count(*) as num from alumnos ");
      var queryFilteredCount = client.query(filteredQuery);
      var query = client.query(queryString);

      //HANDLE ERRORS
      query.on('error', function() {
          console.log("Entro a error");
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
        client.end();
        return res.json(aaData);
      });
    });
};

exports.findById = function(req, res) {
  var results = [];
  //var id = req.params.id.substring(1,req.params.id.length);
  var id = req.params.id;
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
      " FROM contacts where id=($1)",[id]);

    //HANDLE ERRORS
    query.on('error', function() {
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
		User.findUserById(req.session.passport.user, function(user) {
			client.query("INSERT INTO contacts(zauru_entity_id, zauru_seller_id, name, tin, reference, address_line_1, address_line_2, delivery_address, web, phone, email, "+
				"contact, contact_phone, contact_email, contact2, contact2_phone, contact2_email, notes, pdf, image, creator_id, updater_id, created_at, updated_at)"+
				"values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, now(), now())",
				[user.selected_entity, req.body.zauru_seller_id, req.body.name, req.body.tin, req.body.reference,
				req.body.address_line_1, req.body.address_line_2, req.body.delivery_address, req.body.web, req.body.phone, req.body.email, req.body.contact,
				req.body.contact_phone, req.body.contact_email, req.body.contact2, req.body.contact2_phone, req.body.contact2_email, req.body.notes,
				req.body.pdf, req.body.image, user.id, user.id], function(err, result) {
				if (err) {
					console.log(err);
					return res.status(500).json({success: false, data: err});
				} else {
					done();
				}
			});
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
		client.query("UPDATE contacts SET zauru_seller_id=($1), name=($2), tin=($3), reference=($4), address_line_1=($5)," +
			"address_line_2=($6), delivery_address=($7), web=($8), phone=($9), email=($10), contact=($11), contact_phone=($12) ,contact_email=($13) ,"+
			"contact2=($14), contact2_phone=($15), contact2_email=($16), notes=($17), pdf=($18), image=($19), updater_id=($20), updated_at=now() WHERE id=($21)",
			[req.body.zauru_seller_id, req.body.name, req.body.tin, req.body.reference, req.body.address_line_1,
			req.body.address_line_2, req.body.delivery_address, req.body.web, req.body.phone, req.body.email, req.body.contact,
			req.body.contact_phone, req.body.contact_email, req.body.contact2, req.body.contact2_phone, req.body.contact2_email, req.body.notes,
			req.body.pdf, req.body.image, req.session.passport.user, req.params.id], function(err, result) {
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
		client.query("DELETE FROM contacts WHERE id=($1)", [req.params.id], function(err, result) {
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
