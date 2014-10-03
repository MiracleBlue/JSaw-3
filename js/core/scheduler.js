define(function() {
	var Playback = Ember.Object.extend({
		state: null
	});

	var PlaybackStore = Ember.ArrayController.extend({

	});

	var Scheduler = Ember.Object.extend({
		bpm: 130,
		audiolet: null,
		scheduler: null,
		playbackStore: null,

		init: function() {
			this._super();

			// stuff here
			this.scheduler = this.audiolet.scheduler;

			this.playbackStore = PlaybackStore.create();
		},

		play: function (args, options) {
			var self = this;

			var playbackObject = Playback.create({
				state: self.scheduler.play(
					[new PSequence([args], (options.repeat * options.steps || Infinity))],
						(options.per_beat || 1) / 4,
					options.callback
				),
				end: function() {
					console.log("end!")
					self.scheduler.remove(this.get("state"));
					self.playbackStore.removeObject(this);
				}
			});
			this.playbackStore.addObject(
				playbackObject
			);

			console.log("playbackStore", this.playbackStore);

			return playbackObject;
		},

		stop: function() {
			var self = this;
			this.playbackStore.forEach(function(item) {
				self.scheduler.remove(item.get("state"));
			});
		},

		// Observers
		bpmChanged: function() {
			this.scheduler.setTempo(this.get("bpm"));
		}.observes("bpm")
	});

	return Scheduler;
});