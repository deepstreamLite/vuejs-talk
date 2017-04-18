const Peer = require( 'simple-peer' );
const ds = require( '../services/ds' );
window.ds = ds;

Vue.component( 'remote-video', {
	template: `
		<div class="video-feed">
			<video autoplay width="400" height="300" :src="videoSrc"></video>
		</div>
	`,

	props: [ 'remoteuser' ],

	data: function() {
		return {
			videoSrc: null
		}
	},

	created: function() {
		if( ds.localStream ) {
			this._createConnection( ds.localStream );
		} else {
			ds.client.on( 'local-stream-ready', this._createConnection.bind( this ) );
		}

		ds.client.event.subscribe( 'rtc-signal/' + ds.userId, this._onIncomingSignal.bind( this ) );
	},
	methods: {
		_createConnection( localStream ) {
			this._connection = new Peer({
				initiator: ds.userId > this.$props.remoteuser, 
				trickle: false,
				stream: localStream
			});
			this._connection.on( 'error', this._onError.bind( this ) );
			this._connection.on( 'signal', this._onOutgoingSignal.bind( this ) );
			this._connection.on( 'connect', this._onConnect.bind( this ) );
			this._connection.on( 'stream', this._onStream.bind( this ) );
			this._connection.on( 'close', this._onClose.bind( this ) );
		},

		_onStream( stream ) {
			this.$data.videoSrc = window.URL.createObjectURL( stream );
		},

		_onError( error ) {
			console.log( 'error while establishing video feed', error.toString() );
		},

		_onOutgoingSignal( signal ) {
			ds.client.event.emit( 'rtc-signal/' + this.$props.remoteuser, {
				sender: ds.userId,
				signal: signal
			});
		},

		_onIncomingSignal( message ) {
			if( message.sender === this.$props.remoteuser ) {
				this._connection.signal(  message.signal );
			}
		},

		_onConnect() {
			console.log( 'connected' );
		},

		_onClose() {
			ds.users.removeEntry( this.$props.remoteuser );
		}
	}
});