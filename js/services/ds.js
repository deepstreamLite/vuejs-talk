/**
 * Request the deepstream client
 *
 * @type {Deepstream.Factory} the deepstream client factory
 */
const deepstream = require( 'deepstream.io-client-js' );

/**
 * Connect to deepstreamHub using the given URL and API key
 *
 * @type {Deepstream.Client} the deepstream client object
 */
exports.client = deepstream( 'wss://154.deepstreamhub.com?apiKey=a6c10d51-b4ad-4a7f-9713-273978835ce5' );

/**
 * A unique identifier, specifying this user
 *
 * @type {String}
 */
exports.userId = 'user/' + exports.client.getUid();

/**
 * We store all information related to this room in a single global record identified by the room-id
 *
 * @type {Deepstream.Record}
 */
exports.users = exports.client.record.getList( 'users' );

/**
 * Establish the connection to deepstreamHub
 */
exports.client.login();

/**
 * Add ourselves to the list of users
 */
exports.users.addEntry( exports.userId );

/**
 * Missuse this service to pass global references around
 */
exports.localStream = null;