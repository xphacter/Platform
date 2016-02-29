<?php

/**
 * Autogenerated base class representing oAuth rows
 * in the Users database.
 *
 * Don't change this file, since it can be overwritten.
 * Instead, change the Users_OAuth.php file.
 *
 * @module Users
 */
/**
 * Base class representing 'OAuth' rows in the 'Users' database
 * @class Base_Users_OAuth
 * @extends Db_Row
 *
 * @property {string} $client_id
 * @property {string} $userId
 * @property {string} $state
 * @property {string} $scope
 * @property {string} $redirect_uri
 * @property {string} $access_token
 * @property {string|Db_Expression} $insertedTime
 * @property {integer} $token_expires_seconds
 */
abstract class Base_Users_OAuth extends Db_Row
{
	/**
	 * @property $client_id
	 * @type {string}
	 */
	/**
	 * @property $userId
	 * @type {string}
	 */
	/**
	 * @property $state
	 * @type {string}
	 */
	/**
	 * @property $scope
	 * @type {string}
	 */
	/**
	 * @property $redirect_uri
	 * @type {string}
	 */
	/**
	 * @property $access_token
	 * @type {string}
	 */
	/**
	 * @property $insertedTime
	 * @type {string|Db_Expression}
	 */
	/**
	 * @property $token_expires_seconds
	 * @type {integer}
	 */
	/**
	 * The setUp() method is called the first time
	 * an object of this class is constructed.
	 * @method setUp
	 */
	function setUp()
	{
		$this->setDb(self::db());
		$this->setTable(self::table());
		$this->setPrimaryKey(
			array (
			  0 => 'client_id',
			  1 => 'userId',
			  2 => 'state',
			)
		);
	}

	/**
	 * Connects to database
	 * @method db
	 * @static
	 * @return {iDb} The database object
	 */
	static function db()
	{
		return Db::connect('Users');
	}

	/**
	 * Retrieve the table name to use in SQL statement
	 * @method table
	 * @static
	 * @param {boolean} [$with_db_name=true] Indicates wheather table name should contain the database name
 	 * @return {string|Db_Expression} The table name as string optionally without database name if no table sharding
	 * was started or Db_Expression class with prefix and database name templates is table was sharded
	 */
	static function table($with_db_name = true)
	{
		if (Q_Config::get('Db', 'connections', 'Users', 'indexes', 'OAuth', false)) {
			return new Db_Expression(($with_db_name ? '{$dbname}.' : '').'{$prefix}'.'oAuth');
		} else {
			$conn = Db::getConnection('Users');
  			$prefix = empty($conn['prefix']) ? '' : $conn['prefix'];
  			$table_name = $prefix . 'oAuth';
  			if (!$with_db_name)
  				return $table_name;
  			$db = Db::connect('Users');
  			return $db->dbName().'.'.$table_name;
		}
	}
	/**
	 * The connection name for the class
	 * @method connectionName
	 * @static
	 * @return {string} The name of the connection
	 */
	static function connectionName()
	{
		return 'Users';
	}

	/**
	 * Create SELECT query to the class table
	 * @method select
	 * @static
	 * @param {array} $fields The field values to use in WHERE clauseas as 
	 * an associative array of `column => value` pairs
	 * @param {string} [$alias=null] Table alias
	 * @return {Db_Query_Mysql} The generated query
	 */
	static function select($fields, $alias = null)
	{
		if (!isset($alias)) $alias = '';
		$q = self::db()->select($fields, self::table().' '.$alias);
		$q->className = 'Users_OAuth';
		return $q;
	}

	/**
	 * Create UPDATE query to the class table
	 * @method update
	 * @static
	 * @param {string} [$alias=null] Table alias
	 * @return {Db_Query_Mysql} The generated query
	 */
	static function update($alias = null)
	{
		if (!isset($alias)) $alias = '';
		$q = self::db()->update(self::table().' '.$alias);
		$q->className = 'Users_OAuth';
		return $q;
	}

	/**
	 * Create DELETE query to the class table
	 * @method delete
	 * @static
	 * @param {object} [$table_using=null] If set, adds a USING clause with this table
	 * @param {string} [$alias=null] Table alias
	 * @return {Db_Query_Mysql} The generated query
	 */
	static function delete($table_using = null, $alias = null)
	{
		if (!isset($alias)) $alias = '';
		$q = self::db()->delete(self::table().' '.$alias, $table_using);
		$q->className = 'Users_OAuth';
		return $q;
	}

	/**
	 * Create INSERT query to the class table
	 * @method insert
	 * @static
	 * @param {object} [$fields=array()] The fields as an associative array of `column => value` pairs
	 * @param {string} [$alias=null] Table alias
	 * @return {Db_Query_Mysql} The generated query
	 */
	static function insert($fields = array(), $alias = null)
	{
		if (!isset($alias)) $alias = '';
		$q = self::db()->insert(self::table().' '.$alias, $fields);
		$q->className = 'Users_OAuth';
		return $q;
	}
	/**
	 * Inserts multiple records into a single table, preparing the statement only once,
	 * and executes all the queries.
	 * @method insertManyAndExecute
	 * @static
	 * @param {array} [$records=array()] The array of records to insert. 
	 * (The field names for the prepared statement are taken from the first record.)
	 * You cannot use Db_Expression objects here, because the function binds all parameters with PDO.
	 * @param {array} [$options=array()]
	 *   An associative array of options, including:
	 *
	 * * "chunkSize" {integer} The number of rows to insert at a time. defaults to 20.<br/>
	 * * "onDuplicateKeyUpdate" {array} You can put an array of fieldname => value pairs here,
	 * 		which will add an ON DUPLICATE KEY UPDATE clause to the query.
	 *
	 */
	static function insertManyAndExecute($records = array(), $options = array())
	{
		self::db()->insertManyAndExecute(
			self::table(), $records,
			array_merge($options, array('className' => 'Users_OAuth'))
		);
	}
	
	/**
	 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
	 * Optionally accept numeric value which is converted to string
	 * @method beforeSet_client_id
	 * @param {string} $value
	 * @return {array} An array of field name and value
	 * @throws {Exception} An exception is thrown if $value is not string or is exceedingly long
	 */
	function beforeSet_client_id($value)
	{
		if (!isset($value)) {
			$value='';
		}
		if ($value instanceof Db_Expression) {
			return array('client_id', $value);
		}
		if (!is_string($value) and !is_numeric($value))
			throw new Exception('Must pass a string to '.$this->getTable().".client_id");
		if (strlen($value) > 255)
			throw new Exception('Exceedingly long value being assigned to '.$this->getTable().".client_id");
		return array('client_id', $value);			
	}

	/**
	 * Returns the maximum string length that can be assigned to the client_id field
	 * @return {integer}
	 */
	function maxSize_client_id()
	{

		return 255;			
	}

/**
* Returns schema information for client_id column
* @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
*/
	function column_client_id()
	{

return array (
  0 => 
  array (
    0 => 'varchar',
    1 => '255',
    2 => '',
    3 => false,
  ),
  1 => false,
  2 => 'PRI',
  3 => NULL,
);			
	}

	/**
	 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
	 * Optionally accept numeric value which is converted to string
	 * @method beforeSet_userId
	 * @param {string} $value
	 * @return {array} An array of field name and value
	 * @throws {Exception} An exception is thrown if $value is not string or is exceedingly long
	 */
	function beforeSet_userId($value)
	{
		if (!isset($value)) {
			$value='';
		}
		if ($value instanceof Db_Expression) {
			return array('userId', $value);
		}
		if (!is_string($value) and !is_numeric($value))
			throw new Exception('Must pass a string to '.$this->getTable().".userId");
		if (strlen($value) > 255)
			throw new Exception('Exceedingly long value being assigned to '.$this->getTable().".userId");
		return array('userId', $value);			
	}

	/**
	 * Returns the maximum string length that can be assigned to the userId field
	 * @return {integer}
	 */
	function maxSize_userId()
	{

		return 255;			
	}

/**
* Returns schema information for userId column
* @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
*/
	function column_userId()
	{

return array (
  0 => 
  array (
    0 => 'varchar',
    1 => '255',
    2 => '',
    3 => false,
  ),
  1 => false,
  2 => 'PRI',
  3 => NULL,
);			
	}

	/**
	 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
	 * Optionally accept numeric value which is converted to string
	 * @method beforeSet_state
	 * @param {string} $value
	 * @return {array} An array of field name and value
	 * @throws {Exception} An exception is thrown if $value is not string or is exceedingly long
	 */
	function beforeSet_state($value)
	{
		if (!isset($value)) {
			$value='';
		}
		if ($value instanceof Db_Expression) {
			return array('state', $value);
		}
		if (!is_string($value) and !is_numeric($value))
			throw new Exception('Must pass a string to '.$this->getTable().".state");
		if (strlen($value) > 255)
			throw new Exception('Exceedingly long value being assigned to '.$this->getTable().".state");
		return array('state', $value);			
	}

	/**
	 * Returns the maximum string length that can be assigned to the state field
	 * @return {integer}
	 */
	function maxSize_state()
	{

		return 255;			
	}

/**
* Returns schema information for state column
* @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
*/
	function column_state()
	{

return array (
  0 => 
  array (
    0 => 'varchar',
    1 => '255',
    2 => '',
    3 => false,
  ),
  1 => false,
  2 => 'PRI',
  3 => NULL,
);			
	}

	/**
	 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
	 * Optionally accept numeric value which is converted to string
	 * @method beforeSet_scope
	 * @param {string} $value
	 * @return {array} An array of field name and value
	 * @throws {Exception} An exception is thrown if $value is not string or is exceedingly long
	 */
	function beforeSet_scope($value)
	{
		if (!isset($value)) {
			$value='';
		}
		if ($value instanceof Db_Expression) {
			return array('scope', $value);
		}
		if (!is_string($value) and !is_numeric($value))
			throw new Exception('Must pass a string to '.$this->getTable().".scope");
		if (strlen($value) > 255)
			throw new Exception('Exceedingly long value being assigned to '.$this->getTable().".scope");
		return array('scope', $value);			
	}

	/**
	 * Returns the maximum string length that can be assigned to the scope field
	 * @return {integer}
	 */
	function maxSize_scope()
	{

		return 255;			
	}

/**
* Returns schema information for scope column
* @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
*/
	function column_scope()
	{

return array (
  0 => 
  array (
    0 => 'varchar',
    1 => '255',
    2 => '',
    3 => false,
  ),
  1 => false,
  2 => '',
  3 => 'user',
);			
	}

	/**
	 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
	 * Optionally accept numeric value which is converted to string
	 * @method beforeSet_redirect_uri
	 * @param {string} $value
	 * @return {array} An array of field name and value
	 * @throws {Exception} An exception is thrown if $value is not string or is exceedingly long
	 */
	function beforeSet_redirect_uri($value)
	{
		if (!isset($value)) {
			$value='';
		}
		if ($value instanceof Db_Expression) {
			return array('redirect_uri', $value);
		}
		if (!is_string($value) and !is_numeric($value))
			throw new Exception('Must pass a string to '.$this->getTable().".redirect_uri");
		if (strlen($value) > 255)
			throw new Exception('Exceedingly long value being assigned to '.$this->getTable().".redirect_uri");
		return array('redirect_uri', $value);			
	}

	/**
	 * Returns the maximum string length that can be assigned to the redirect_uri field
	 * @return {integer}
	 */
	function maxSize_redirect_uri()
	{

		return 255;			
	}

/**
* Returns schema information for redirect_uri column
* @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
*/
	function column_redirect_uri()
	{

return array (
  0 => 
  array (
    0 => 'varchar',
    1 => '255',
    2 => '',
    3 => false,
  ),
  1 => false,
  2 => '',
  3 => NULL,
);			
	}

	/**
	 * Method is called before setting the field and verifies if value is string of length within acceptable limit.
	 * Optionally accept numeric value which is converted to string
	 * @method beforeSet_access_token
	 * @param {string} $value
	 * @return {array} An array of field name and value
	 * @throws {Exception} An exception is thrown if $value is not string or is exceedingly long
	 */
	function beforeSet_access_token($value)
	{
		if (!isset($value)) {
			$value='';
		}
		if ($value instanceof Db_Expression) {
			return array('access_token', $value);
		}
		if (!is_string($value) and !is_numeric($value))
			throw new Exception('Must pass a string to '.$this->getTable().".access_token");
		if (strlen($value) > 255)
			throw new Exception('Exceedingly long value being assigned to '.$this->getTable().".access_token");
		return array('access_token', $value);			
	}

	/**
	 * Returns the maximum string length that can be assigned to the access_token field
	 * @return {integer}
	 */
	function maxSize_access_token()
	{

		return 255;			
	}

/**
* Returns schema information for access_token column
* @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
*/
	function column_access_token()
	{

return array (
  0 => 
  array (
    0 => 'varchar',
    1 => '255',
    2 => '',
    3 => false,
  ),
  1 => false,
  2 => '',
  3 => NULL,
);			
	}

	/**
	 * Method is called before setting the field and normalize the DateTime string
	 * @method beforeSet_insertedTime
	 * @param {string} $value
	 * @return {array} An array of field name and value
	 * @throws {Exception} An exception is thrown if $value does not represent valid DateTime
	 */
	function beforeSet_insertedTime($value)
	{
		if ($value instanceof Db_Expression) {
			return array('insertedTime', $value);
		}
		$date = date_parse($value);
		if (!empty($date['errors'])) {
			$json = json_encode($value);
			throw new Exception("DateTime $json in incorrect format being assigned to ".$this->getTable().".insertedTime");
		}
		$value = sprintf("%04d-%02d-%02d %02d:%02d:%02d", 
			$date['year'], $date['month'], $date['day'], 
			$date['hour'], $date['minute'], $date['second']
		);
		return array('insertedTime', $value);			
	}

/**
* Returns schema information for insertedTime column
* @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
*/
	function column_insertedTime()
	{

return array (
  0 => 
  array (
    0 => 'timestamp',
    1 => '255',
    2 => '',
    3 => false,
  ),
  1 => false,
  2 => '',
  3 => 'CURRENT_TIMESTAMP',
);			
	}

	/**
	 * Method is called before setting the field and verifies if integer value falls within allowed limits
	 * @method beforeSet_token_expires_seconds
	 * @param {integer} $value
	 * @return {array} An array of field name and value
	 * @throws {Exception} An exception is thrown if $value is not integer or does not fit in allowed range
	 */
	function beforeSet_token_expires_seconds($value)
	{
		if (!isset($value)) {
			return array('token_expires_seconds', $value);
		}
		if ($value instanceof Db_Expression) {
			return array('token_expires_seconds', $value);
		}
		if (!is_numeric($value) or floor($value) != $value)
			throw new Exception('Non-integer value being assigned to '.$this->getTable().".token_expires_seconds");
		$value = intval($value);
		if ($value < -2147483648 or $value > 2147483647) {
			$json = json_encode($value);
			throw new Exception("Out-of-range value $json being assigned to ".$this->getTable().".token_expires_seconds");
		}
		return array('token_expires_seconds', $value);			
	}

	/**
	 * @method maxSize_token_expires_seconds
	 * Returns the maximum integer that can be assigned to the token_expires_seconds field
	 * @return {integer}
	 */
	function maxSize_token_expires_seconds()
	{

		return 2147483647;			
	}

/**
* Returns schema information for token_expires_seconds column
* @return {array} [[typeName, displayRange, modifiers, unsigned], isNull, key, default]
*/
	function column_token_expires_seconds()
	{

return array (
  0 => 
  array (
    0 => 'int',
    1 => '11',
    2 => '',
    3 => false,
  ),
  1 => true,
  2 => '',
  3 => NULL,
);			
	}

	/**
	 * Check if mandatory fields are set and updates 'magic fields' with appropriate values
	 * @method beforeSave
	 * @param {array} $value The array of fields
	 * @return {array}
	 * @throws {Exception} If mandatory field is not set
	 */
	function beforeSave($value)
	{
		if (!$this->retrieved) {
			$table = $this->getTable();
			foreach (array('client_id','userId','state') as $name) {
				if (!isset($value[$name])) {
					throw new Exception("the field $table.$name needs a value, because it is NOT NULL, not auto_increment, and lacks a default value.");
				}
			}
		}
		return $value;			
	}

	/**
	 * Retrieves field names for class table
	 * @method fieldNames
	 * @static
	 * @param {string} [$table_alias=null] If set, the alieas is added to each field
	 * @param {string} [$field_alias_prefix=null] If set, the method returns associative array of `'prefixed field' => 'field'` pairs
	 * @return {array} An array of field names
	 */
	static function fieldNames($table_alias = null, $field_alias_prefix = null)
	{
		$field_names = array('client_id', 'userId', 'state', 'scope', 'redirect_uri', 'access_token', 'insertedTime', 'token_expires_seconds');
		$result = $field_names;
		if (!empty($table_alias)) {
			$temp = array();
			foreach ($result as $field_name)
				$temp[] = $table_alias . '.' . $field_name;
			$result = $temp;
		} 
		if (!empty($field_alias_prefix)) {
			$temp = array();
			reset($field_names);
			foreach ($result as $field_name) {
				$temp[$field_alias_prefix . current($field_names)] = $field_name;
				next($field_names);
			}
			$result = $temp;
		}
		return $result;			
	}
};