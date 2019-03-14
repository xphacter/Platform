/**
 * Autogenerated base class representing mobile rows
 * in the Users database.
 *
 * Don't change this file, since it can be overwritten.
 * Instead, change the Users/Mobile.js file.
 *
 * @module Users
 */

var Q = require('Q');
var Db = Q.require('Db');
var Users = Q.require('Users');
var Row = Q.require('Db/Row');

/**
 * Base class representing 'Mobile' rows in the 'Users' database
 * @namespace Base.Users
 * @class Mobile
 * @extends Db.Row
 * @constructor
 * @param {object} [fields={}] The fields values to initialize table row as 
 * an associative array of {column: value} pairs
 * @param {string} [$fields.number] defaults to ""
 * @param {string|Db_Expression} [$fields.insertedTime] defaults to new Db_Expression("CURRENT_TIMESTAMP")
 * @param {string|Db_Expression} [$fields.updatedTime] defaults to null
 * @param {string} [$fields.userId] defaults to ""
 * @param {string} [$fields.extension] defaults to ""
 * @param {string} [$fields.carrier] defaults to "unverified"
 * @param {string} [$fields.state] defaults to "unverified"
 * @param {string} [$fields.capabilities] defaults to "unverified"
 * @param {string} [$fields.activationCode] defaults to ""
 * @param {string|Db_Expression} [$fields.activationCodeExpires] defaults to null
 * @param {string} [$fields.authCode] defaults to ""
 */
function Base (fields) {
	Base.constructors.apply(this, arguments);
}

Q.mixin(Base, Row);

/**
 * @property number
 * @type String|Buffer
 * @default ""
 * 
 */
/**
 * @property insertedTime
 * @type String|Db.Expression
 * @default new Db_Expression("CURRENT_TIMESTAMP")
 * 
 */
/**
 * @property updatedTime
 * @type String|Db.Expression
 * @default null
 * 
 */
/**
 * @property userId
 * @type String|Buffer
 * @default ""
 * 
 */
/**
 * @property extension
 * @type String
 * @default ""
 * 
 */
/**
 * @property carrier
 * @type String
 * @default "unverified"
 * 
 */
/**
 * @property state
 * @type String
 * @default "unverified"
 * 
 */
/**
 * @property capabilities
 * @type String
 * @default "unverified"
 * 
 */
/**
 * @property activationCode
 * @type String|Buffer
 * @default ""
 * 
 */
/**
 * @property activationCodeExpires
 * @type String|Db.Expression
 * @default null
 * 
 */
/**
 * @property authCode
 * @type String|Buffer
 * @default ""
 * Used in all links sent by sms, to authenticate the source
 */

/**
 * This method calls Db.connect() using information stored in the configuration.
 * If this has already been called, then the same db object is returned.
 * @method db
 * @return {Db} The database connection
 */
Base.db = function () {
	return Users.db();
};

/**
 * Retrieve the table name to use in SQL statements
 * @method table
 * @param {boolean} [withoutDbName=false] Indicates wheather table name should contain the database name
 * @return {String|Db.Expression} The table name as string optionally without database name if no table sharding was started
 * or Db.Expression object with prefix and database name templates is table was sharded
 */
Base.table = function (withoutDbName) {
	if (Q.Config.get(['Db', 'connections', 'Users', 'indexes', 'Mobile'], false)) {
		return new Db.Expression((withoutDbName ? '' : '{$dbname}.')+'{$prefix}mobile');
	} else {
		var conn = Db.getConnection('Users');
		var prefix = conn.prefix || '';
		var tableName = prefix + 'mobile';
		var dbname = Base.table.dbname;
		if (!dbname) {
			var dsn = Db.parseDsnString(conn['dsn']);
			dbname = Base.table.dbname = dsn.dbname;
		}
		return withoutDbName ? tableName : dbname + '.' + tableName;
	}
};

/**
 * The connection name for the class
 * @method connectionName
 * @return {String} The name of the connection
 */
Base.connectionName = function() {
	return 'Users';
};

/**
 * Create SELECT query to the class table
 * @method SELECT
 * @param {String|Object} [fields=null] The fields as strings, or object of {alias:field} pairs.
 *   The default is to return all fields of the table.
 * @param {String|Object} [alias=null] The tables as strings, or object of {alias:table} pairs.
 * @return {Db.Query.Mysql} The generated query
 */
Base.SELECT = function(fields, alias) {
	if (!fields) {
		fields = Base.fieldNames().map(function (fn) {
			return fn;
		}).join(',');
	}
	var q = Base.db().SELECT(fields, Base.table()+(alias ? ' '+alias : ''));
	q.className = 'Users_Mobile';
	return q;
};

/**
 * Create UPDATE query to the class table. Use Db.Query.Mysql.set() method to define SET clause
 * @method UPDATE
 * @param {String} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.UPDATE = function(alias) {
	var q = Base.db().UPDATE(Base.table()+(alias ? ' '+alias : ''));
	q.className = 'Users_Mobile';
	return q;
};

/**
 * Create DELETE query to the class table
 * @method DELETE
 * @param {Object}[table_using=null] If set, adds a USING clause with this table
 * @param {String} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.DELETE = function(table_using, alias) {
	var q = Base.db().DELETE(Base.table()+(alias ? ' '+alias : ''), table_using);
	q.className = 'Users_Mobile';
	return q;
};

/**
 * Create INSERT query to the class table
 * @method INSERT
 * @param {Object} [fields={}] The fields as an associative array of {column: value} pairs
 * @param {String} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.INSERT = function(fields, alias) {
	var q = Base.db().INSERT(Base.table()+(alias ? ' '+alias : ''), fields || {});
	q.className = 'Users_Mobile';
	return q;
};

/**
 * Create raw query with BEGIN clause.
 * You'll have to specify shards yourself when calling execute().
 * @method BEGIN
 * @param {string} [$lockType] First parameter to pass to query.begin() function
 * @return {Db.Query.Mysql} The generated query
 */
Base.BEGIN = function($lockType) {
	var q = Base.db().rawQuery('').begin($lockType);
	q.className = 'Users_Mobile';
	return q;
};

/**
 * Create raw query with COMMIT clause
 * You'll have to specify shards yourself when calling execute().
 * @method COMMIT
 * @return {Db.Query.Mysql} The generated query
 */
Base.COMMIT = function() {
	var q = Base.db().rawQuery('').commit();
	q.className = 'Users_Mobile';
	return q;
};

/**
 * Create raw query with ROLLBACK clause
 * @method ROLLBACK
 * @param {Object} criteria can be used to target the query to some shards.
 *   Otherwise you'll have to specify shards yourself when calling execute().
 * @return {Db.Query.Mysql} The generated query
 */
Base.ROLLBACK = function(criteria) {
	var q = Base.db().rawQuery('').rollback(crieria);
	q.className = 'Users_Mobile';
	return q;
};

/**
 * The name of the class
 * @property className
 * @type string
 */
Base.prototype.className = "Users_Mobile";

// Instance methods

/**
 * Create INSERT query to the class table
 * @method INSERT
 * @param {object} [fields={}] The fields as an associative array of {column: value} pairs
 * @param {string} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.prototype.setUp = function() {
	// does nothing for now
};

/**
 * Create INSERT query to the class table
 * @method INSERT
 * @param {object} [fields={}] The fields as an associative array of {column: value} pairs
 * @param {string} [alias=null] Table alias
 * @return {Db.Query.Mysql} The generated query
 */
Base.prototype.db = function () {
	return Base.db();
};

/**
 * Retrieve the table name to use in SQL statements
 * @method table
 * @param {boolean} [withoutDbName=false] Indicates wheather table name should contain the database name
 * @return {String|Db.Expression} The table name as string optionally without database name if no table sharding was started
 * or Db.Expression object with prefix and database name templates is table was sharded
 */
Base.prototype.table = function () {
	return Base.table();
};

/**
 * Retrieves primary key fields names for class table
 * @method primaryKey
 * @return {string[]} An array of field names
 */
Base.prototype.primaryKey = function () {
	return [
		"number"
	];
};

/**
 * Retrieves field names for class table
 * @method fieldNames
 * @return {array} An array of field names
 */
Base.prototype.fieldNames = function () {
	return Base.fieldNames();
};

/**
 * Retrieves field names for class table
 * @method fieldNames
 * @static
 * @return {array} An array of field names
 */
Base.fieldNames = function () {
	return [
		"number",
		"insertedTime",
		"updatedTime",
		"userId",
		"extension",
		"carrier",
		"state",
		"capabilities",
		"activationCode",
		"activationCodeExpires",
		"authCode"
	];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_number
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_number = function (value) {
		if (value == null) {
			value='';
		}
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Buffer))
			throw new Error('Must pass a String or Buffer to '+this.table()+".number");
		if (typeof value === "string" && value.length > 255)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".number");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the number field
	 * @return {integer}
	 */
Base.prototype.maxSize_number = function () {

		return 255;
};

	/**
	 * Returns schema information for number column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_number = function () {

return [["varbinary","255","",false],false,"PRI",null];
};

/**
 * Method is called before setting the field
 * @method beforeSet_insertedTime
 * @param {String} value
 * @return {Date|Db.Expression} If 'value' is not Db.Expression the current date is returned
 */
Base.prototype.beforeSet_insertedTime = function (value) {
		if (value instanceof Db.Expression) return value;
		if (typeof value !== 'object' && !isNaN(value)) {
			value = parseInt(value);
			value = new Date(value < 10000000000 ? value * 1000 : value);
		}
		value = (value instanceof Date) ? Base.db().toDateTime(value) : value;
		return value;
};

	/**
	 * Returns schema information for insertedTime column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_insertedTime = function () {

return [["timestamp","255","",false],false,"","CURRENT_TIMESTAMP"];
};

/**
 * Method is called before setting the field
 * @method beforeSet_updatedTime
 * @param {String} value
 * @return {Date|Db.Expression} If 'value' is not Db.Expression the current date is returned
 */
Base.prototype.beforeSet_updatedTime = function (value) {
		if (value == undefined) return value;
		if (value instanceof Db.Expression) return value;
		if (typeof value !== 'object' && !isNaN(value)) {
			value = parseInt(value);
			value = new Date(value < 10000000000 ? value * 1000 : value);
		}
		value = (value instanceof Date) ? Base.db().toDateTime(value) : value;
		return value;
};

	/**
	 * Returns schema information for updatedTime column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_updatedTime = function () {

return [["timestamp","255","",false],true,"MUL",null];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_userId
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_userId = function (value) {
		if (value == null) {
			value='';
		}
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Buffer))
			throw new Error('Must pass a String or Buffer to '+this.table()+".userId");
		if (typeof value === "string" && value.length > 31)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".userId");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the userId field
	 * @return {integer}
	 */
Base.prototype.maxSize_userId = function () {

		return 31;
};

	/**
	 * Returns schema information for userId column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_userId = function () {

return [["varbinary","31","",false],false,"MUL",""];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_extension
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_extension = function (value) {
		if (value == null) {
			value='';
		}
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number")
			throw new Error('Must pass a String to '+this.table()+".extension");
		if (typeof value === "string" && value.length > 7)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".extension");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the extension field
	 * @return {integer}
	 */
Base.prototype.maxSize_extension = function () {

		return 7;
};

	/**
	 * Returns schema information for extension column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_extension = function () {

return [["varchar","7","",false],false,"",""];
};

/**
 * Method is called before setting the field and verifies if value belongs to enum values list
 * @method beforeSet_carrier
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' does not belong to enum values list
 */
Base.prototype.beforeSet_carrier = function (value) {
		if (value instanceof Db.Expression) return value;
		if (['unverified','att','cingular','sprint','tmobile','verizon'].indexOf(value) < 0)
			throw new Error("Out-of-range value "+JSON.stringify(value)+" being assigned to "+this.table()+".carrier");
		return value;
};

	/**
	 * Returns schema information for carrier column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_carrier = function () {

return [["enum","'unverified','att','cingular','sprint','tmobile','verizon'","",false],false,"","unverified"];
};

/**
 * Method is called before setting the field and verifies if value belongs to enum values list
 * @method beforeSet_state
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' does not belong to enum values list
 */
Base.prototype.beforeSet_state = function (value) {
		if (value instanceof Db.Expression) return value;
		if (['unverified','active','suspended','unsubscribed'].indexOf(value) < 0)
			throw new Error("Out-of-range value "+JSON.stringify(value)+" being assigned to "+this.table()+".state");
		return value;
};

	/**
	 * Returns schema information for state column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_state = function () {

return [["enum","'unverified','active','suspended','unsubscribed'","",false],false,"","unverified"];
};

/**
 * Method is called before setting the field and verifies if value belongs to enum values list
 * @method beforeSet_capabilities
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' does not belong to enum values list
 */
Base.prototype.beforeSet_capabilities = function (value) {
		if (value instanceof Db.Expression) return value;
		if (['unverified','sms','wap','internet','sms_and_wap','sms_and_internet'].indexOf(value) < 0)
			throw new Error("Out-of-range value "+JSON.stringify(value)+" being assigned to "+this.table()+".capabilities");
		return value;
};

	/**
	 * Returns schema information for capabilities column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_capabilities = function () {

return [["enum","'unverified','sms','wap','internet','sms_and_wap','sms_and_internet'","",false],false,"","unverified"];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_activationCode
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_activationCode = function (value) {
		if (value == null) {
			value='';
		}
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Buffer))
			throw new Error('Must pass a String or Buffer to '+this.table()+".activationCode");
		if (typeof value === "string" && value.length > 255)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".activationCode");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the activationCode field
	 * @return {integer}
	 */
Base.prototype.maxSize_activationCode = function () {

		return 255;
};

	/**
	 * Returns schema information for activationCode column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_activationCode = function () {

return [["varbinary","255","",false],false,"",null];
};

/**
 * Method is called before setting the field
 * @method beforeSet_activationCodeExpires
 * @param {String} value
 * @return {Date|Db.Expression} If 'value' is not Db.Expression the current date is returned
 */
Base.prototype.beforeSet_activationCodeExpires = function (value) {
		if (value == undefined) return value;
		if (value instanceof Db.Expression) return value;
		if (typeof value !== 'object' && !isNaN(value)) {
			value = parseInt(value);
			value = new Date(value < 10000000000 ? value * 1000 : value);
		}
		value = (value instanceof Date) ? Base.db().toDateTime(value) : value;
		return value;
};

	/**
	 * Returns schema information for activationCodeExpires column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_activationCodeExpires = function () {

return [["timestamp","255","",false],true,"",null];
};

/**
 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
 * Optionally accept numeric value which is converted to string
 * @method beforeSet_authCode
 * @param {string} value
 * @return {string} The value
 * @throws {Error} An exception is thrown if 'value' is not string or is exceedingly long
 */
Base.prototype.beforeSet_authCode = function (value) {
		if (value == null) {
			value='';
		}
		if (value instanceof Db.Expression) return value;
		if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Buffer))
			throw new Error('Must pass a String or Buffer to '+this.table()+".authCode");
		if (typeof value === "string" && value.length > 255)
			throw new Error('Exceedingly long value being assigned to '+this.table()+".authCode");
		return value;
};

	/**
	 * Returns the maximum string length that can be assigned to the authCode field
	 * @return {integer}
	 */
Base.prototype.maxSize_authCode = function () {

		return 255;
};

	/**
	 * Returns schema information for authCode column
	 * @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
	 */
Base.column_authCode = function () {

return [["varbinary","255","",false],false,"",null];
};

/**
 * Check if mandatory fields are set and updates 'magic fields' with appropriate values
 * @method beforeSave
 * @param {Object} value The object of fields
 * @param {Function} callback Call this callback if you return null
 * @return {Object|null} Return the fields, modified if necessary. If you return null, then you should call the callback(err, modifiedFields)
 * @throws {Error} If e.g. mandatory field is not set or a bad values are supplied
 */
Base.prototype.beforeSave = function (value) {
	var fields = ['number'], i;
	if (!this._retrieved) {
		var table = this.table();
		for (i=0; i<fields.length; i++) {
			if (this.fields[fields[i]] === undefined) {
				throw new Error("the field "+table+"."+fields[i]+" needs a value, because it is NOT NULL, not auto_increment, and lacks a default value.");
			}
		}
	}
	// convention: we'll have updatedTime = insertedTime if just created.
	this['updatedTime'] = value['updatedTime'] = new Db.Expression('CURRENT_TIMESTAMP');
	return value;
};

module.exports = Base;