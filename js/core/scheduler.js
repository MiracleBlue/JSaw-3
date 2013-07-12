define(function() {
	var Playback = Ember.Object.extend({
		state: null
	});

	var PlaybackStore = Ember.ArrayController.extend({

	});

	var Scheduler = Ember.Object.extend({
		bpm: 130,
		scheduler: null,
		playbackStore: null,

		init: function() {
			this._super();

			// stuff here
			this.scheduler = App.audiolet.scheduler;

			this.playbackStore = PlaybackStore.create();
		},

		play: function (args, options) {
			this.playbackStore.addObject(
				Playback.create({
					state: this.scheduler.play(
						[new PSequence([args], (options.repeat || Infinity))],
						(options.per_beat || 1) / 4,
						options.callback
					)
				})
			);

			console.log("playbackStore", this.playbackStore);
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