
var mysql                                   = require('mysql');
var moment                                  = require('moment');

// var logging                                 = require('./../logging/logging');
var envProperties                           = require('./../properties/environmentDetails');

exports.initializeConnectionPool            = initializeConnectionPool;
exports.updateMysqlTable                    = updateMysqlTable;
exports.mysqlSlaveQueryPromise              = mysqlSlaveQueryPromise;
exports.mysqlQueryPromise                   = mysqlQueryPromise;


function initializeConnectionPool(dbConfig) {
  return new Promise((resolve, reject) =>{
    console.log('CALLING INITIALIZE POOL');
    var numConnectionsInPool = 0;
    var conn = mysql.createPool(dbConfig);
    conn.on('connection', function (connection) {
      numConnectionsInPool++;
      console.log('NUMBER OF CONNECTION IN POOL : ', numConnectionsInPool);
    });
    return resolve(conn);
  });
}


var dbClient = {
  executeQuery     : function (queryObject, callback, apiReference, noErrorlog) {
    var sql = connection.query(queryObject.query, queryObject.args, function (err, result) {
      var event = queryObject.event || "Executing mysql query";
      if (!apiReference) {
        apiReference = {
          module: "mysqlLib",
          api   : "executeQuery"
        }
      }
      // logging.log(apiReference, {EVENT: event, ERROR: err, RESULT: result, QUERY: sql.sql});
      if (err) {
        if (!noErrorlog) {
          logSqlError(apiReference, event, err, result, sql.sql);
        }
        if (err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED') {
          setTimeout(module.exports.dbHandler.executeQuery.bind(null, queryObject, callback, apiReference), 50);
        } else {
          callback(err, result, sql);
        }
      } else {
        callback(err, result, sql);
      }
    });
  },
  executeSlaveQuery: function (queryObject, callback, apiReference, noErrorlog) {
    var sql = slaveConnection.query(queryObject.query, queryObject.args, function (err, result) {
      var event = queryObject.event || "Executing mysql query";
      if (!apiReference) {
        apiReference = {
          module: "mysqlLib",
          api   : "executeSlaveQuery"
        }
      }
      // logging.log(apiReference, {EVENT: event, ERROR: err, RESULT: result, QUERY: sql.sql});
      if (err) {
        if (!noErrorlog) {
          logSqlError(apiReference, event, err, result, sql.sql);
        }
        if (err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED') {
          setTimeout(module.exports.dbHandler.executeSlaveQuery.bind(null, queryObject, callback, apiReference), 50);
        } else {
          callback(err, result, sql);
        }
      } else {
        callback(err, result, sql);
      }
    });
  }
};

exports.dbHandler = (function () {
  return dbClient;
})();


function logSqlError(apiReference, event, err, result, sql) {
  if (!sql) {
    sql = {};
  }
  var log = {EVENT: event, ERROR: err, RESULT: result, QUERY: sql};
  try {
    log = JSON.stringify(log);
  }
  catch (exception) {
  }
  console.error("--> Error in sql query " + moment(new Date()).format('YYYY-MM-DD hh:mm:ss.SSS') + " :----: " +
    apiReference.module + " :=: " + apiReference.api + " :=: " + log);

}

function mysqlQueryPromise(apiReference, event, queryString, params, noErrorlog) {
  return new Promise((resolve, reject) => {
    if (!apiReference) {
      apiReference = {
        module: "mysqlLib",
        api   : "executeQuery"
      }
    }
    var query = connection.query(queryString, params, function (sqlError, sqlResult) {
      // logging.log(apiReference, {
      //   EVENT     : "Executing query " + event, QUERY: query.sql, SQL_ERROR: sqlError,
      //   SQL_RESULT: sqlResult, SQL_RESULT_LENGTH: sqlResult && sqlResult.length
      // });
      if (sqlError || !sqlResult) {
        if (sqlError) {
          if (!noErrorlog) {
            logSqlError(apiReference, event, sqlError, sqlResult, query.sql);
          }
          if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED') {
            setTimeout(module.exports.mysqlQueryPromise.bind(null, apiReference, event, queryString, params), 50);
          } else {
            return reject({ERROR: sqlError, QUERY: query.sql, EVENT: event});
          }
        }
      }
      return resolve(sqlResult);
    });
  });
}


function mysqlSlaveQueryPromise(apiReference, event, queryString, params, noErrorlog) {
  return new Promise((resolve, reject) => {
    if (!apiReference) {
      apiReference = {
        module: "mysqlLib",
        api   : "executeSlaveQuery"
      }
    }
    var query = slaveConnection.query(queryString, params, function (sqlError, sqlResult) {
      // logging.log(apiReference, {
      //   EVENT     : "Executing slave query " + event, QUERY: query.sql, SQL_ERROR: sqlError,
      //   SQL_RESULT: sqlResult, SQL_RESULT_LENGTH: sqlResult && sqlResult.length
      // });
      if (sqlError || !sqlResult) {
        if (sqlError) {
          if (!noErrorlog) {
            logSqlError(apiReference, event, sqlError, sqlResult, query.sql);
          }
          if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED') {
            setTimeout(module.exports.mysqlSlaveQueryPromise.bind(null, apiReference, event, queryString, params), 50);
          } else {
            return reject({ERROR: sqlError, QUERY: query.sql, EVENT: event});
          }
        }
      }
      return resolve(sqlResult);
    });
  });
}


function updateMysqlTable(apiReference, event, tableName, newdata, condition, queryEnding) {
  return new Promise((resolve, reject) => {
    var sql       = "UPDATE ?? SET ? WHERE ";
    var sqlParams = [tableName, newdata];
    for (var key in condition) {
      sql += key + " = ? AND ";
      sqlParams.push(condition[key]);
    }
    sql = sql.slice(0, -4) + " " + (queryEnding || "");

    var query = connection.query(sql, sqlParams, function (sqlError, sqlResult) {
      // logging.log(apiReference, {EVENT: "Update query " + event, QUERY: query.sql, SQL_RESULT: sqlResult});

      if (sqlError || !sqlResult) {
        // logging.logError(apiReference, {
        //   EVENT    : "Error in update query " + event, QUERY: query.sql,
        //   SQL_ERROR: sqlError
        // });
        return reject(sqlError);
      }

      return resolve(sqlResult);
    });
  });
}
