const ds = require( '../services/ds' );

Vue.component( 'local-video', {
	template: `
		<div class="video-feed">
			<video autoplay width="400" height="300" :src="videoSrc"></video>
		</div>
	`,
	data: function() {
		return {
			videoSrc: null
		}
	},

	created: function() {
		navigator.getUserMedia(
			{ video: true, audio: true }, 
			this._onStream.bind( this ), 
			this._onError.bind( this)
		);
	},
	methods: {
		_onStream( stream ) {
			this.$data.videoSrc = window.URL.createObjectURL( stream );
			ds.localStream = stream;
			ds.client.emit( 'local-stream-ready', stream );
		},

		_onError( error ) {
			console.log( 'error while retrieving video feed', error.toString() );
		}
	}
});

