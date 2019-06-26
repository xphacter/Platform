<?php

/**
 * Invites a user (or a future user) to a stream .
 * @param {array} $_REQUEST
 * @param {string} $_REQUEST.publisherId The id of the stream publisher
 * @param {string} $_REQUEST.streamName The name of the stream the user will be invited to
 *  @param {string} [$_REQUEST.userId] user id or an array of user ids
 * @param {string} [$_REQUEST.platform] platform for which xids are passed
 * @param {string|array} [$_REQUEST.xid]  platform xid or array of xids
 *  @param {string} [$_REQUEST.label]  label or an array of labels, or tab-delimited string
 *  @param {string} [$_REQUEST.identifier] identifier or an array of identifiers
 *  @param {string|array} [$_REQUEST.addLabel] label or an array of labels for adding publisher's contacts
 *  @param {string|array} [$_REQUEST.addMyLabel] label or an array of labels for adding logged-in user's contacts
 *  @param {string} [$_REQUEST.readLevel] the read level to grant those who are invited
 *  @param {string} [$_REQUEST.writeLevel] the write level to grant those who are invited
 *  @param {string} [$_REQUEST.adminLevel] the admin level to grant those who are invited
 *  @param {string} [$_REQUEST.appUrl] Can be used to override the URL to which the invited user will be redirected and receive "Q.Streams.token" in the querystring.
 */
function Streams_invite_post()
{
	$publisherId = Streams::requestedPublisherId(true);
	$streamName = Streams::requestedName(true);
	
	$r = Q::take($_REQUEST, array(
		'readLevel', 'writeLevel', 'adminLevel', 'permissions',
		'addLabel', 'addMyLabel', 'appUrl',
		'userId', 'xid', 'platform', 'label', 'identifier'
	));

	$stream = Streams::fetchOne(null, $publisherId, $streamName, true);
	Streams::$cache['invite'] = Streams::invite($publisherId, $streamName, $r, $r);
	
	Q_Response::setSlot('stream', $stream->exportArray());
	Q_Response::setSlot('data', Streams::$cache['invite']);
}
