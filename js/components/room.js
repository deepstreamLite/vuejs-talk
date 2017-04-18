const ds = require( '../services/ds' );

Vue.component( 'room', {
	template: `
		<div class="room">
			<local-video></local-video>
			<div v-for="remoteUser in remoteUsers">
				<remote-video :remoteuser="remoteUser"></remote-video>
			</div>
		</div>
	`,
	data: function() {
		return {
			remoteUsers: []
		}
	},

	created() {
		ds.users.subscribe( this._setRemoteUsers.bind( this ), true );
	},

	methods: {
		_setRemoteUsers( users ) {
			this.$data.remoteUsers = users.filter( user => { return user !== ds.userId });
		}
	}
});