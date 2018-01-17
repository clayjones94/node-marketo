var _ = require('lodash'),
    Promise = require('bluebird'),
    util = require('../util'),
    log = util.logger();

function Activities(marketo, connection) {
  this._marketo = marketo;
  this._connection = connection;
}

Activities.prototype = {
  getActivityTypes: function() {
    var path = util.createPath('activities', 'types.json');
    
    return this._connection.get(path, { _method: 'GET' });
  },

	getBulkActivityJobs: function() {
		var path = util.createPath('activities', 'export.json');
		return this._connection.get(path, { _method: 'GET', bulk: true });
	},

	getBulkActivityStatus: function(exportID) {
		var path = util.createPath('activities', 'export', exportID, 'status.json');
		return this._connection.get(path, { _method: 'GET', bulk: true });
	},

	getBulkActivityFile: function(exportID) {
		var path = util.createPath('activities', 'export', exportID, 'file.json');
		return this._connection.get(path, { _method: 'GET', bulk: true });
	},

	createBulkActivityExtract: function(createdAt, activityTypeIds, columnHeaderNames, fields, format) {
		var path = util.createPath('activities', 'export', 'create.json');
		if (!_.isObject(createdAt)) {
		  var msg = 'createdAt must be an object';
		  log.error(msg);
		  // return Promise.reject(msg);
		}
		var body = {'filter': {'createdAt': createdAt}}
		if (activityTypeIds && !_.isArray(activityTypeIds)) {
			var msg = 'activityTypeIds must be an array';
			log.error(msg);
			// return Promise.reject(msg);
		} else if (activityTypeIds) {
			body['filter'] = _.extend({}, body['filter'], {
				activityTypeIds: activityTypeIds
			});
		}

		if (columnHeaderNames && !_.isObject(columnHeaderNames)) {
			var msg = 'columnHeaderNames must be an array';
			log.error(msg);
			// return Promise.reject(msg);
		} else if (columnHeaderNames) {
			body = _.extend({}, body, {
				columnHeaderNames: columnHeaderNames
			});
		}

		if (fields) {
			body = _.extend({}, body, {
				fields: fields
			});
		}

		if (format) {
			body = _.extend({}, body, {
				format: format
			});
		}

		body = _.extend({}, body, {
			bulk: true
		});

		return this._connection.postJson(path, body)
	}
}

module.exports = Activities;