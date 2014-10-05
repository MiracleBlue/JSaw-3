define(function() {
	var Playback = Ember.Object.extend({
		state: null
	});

	var PlaybackStore = Ember.ArrayController.extend({

	});

	var Scheduler = Ember.Object.extend(Ember.Evented, {
		bpm: 130,
		audiolet: null,
		scheduler: null,
		playbackStore: null,
		playbackObject: null,
		step: 0,
		length: 16,
		playing: false,

		init: function() {
			this._super();

			// stuff here
			this.scheduler = this.audiolet.scheduler;

			this.playbackStore = PlaybackStore.create();
		},

		play: function() {
			var self = this;

			console.log("scheduler play", this.scheduler);

			var playbackObject = Playback.create({
				state: self.scheduler.play(
					[new PSequence([[]], (Infinity))],
					1 / 4,
					function() {
						self.trigger("changeStep", self.get("step"));
						var step = self.get("step");
						var reset = (step === self.get("length") - 1);
						var next = reset ? 0 : step + 1;

						self.set("step", next);
					}
				),
				removeFromPlayback: function() {
					self.scheduler.remove(this.get("state"));
					self.playbackStore.removeObject(this);
				},
				pause: function() {
					self.set("playing", false);
					self.trigger("pause");
					this.removeFromPlayback();
				},
				end: function() {
					console.log("end!");
					self.set("playing", false);

					self.trigger("stop");
					this.removeFromPlayback();
					self.set("step", 0);
				}
			});

			this.playbackStore.addObject(
				playbackObject
			);

			this.set("playbackObject", playbackObject);
			this.set("playing", true);

			this.trigger("play", this.get("step"));

			return playbackObject;
		},

		pause: function() {
			this.get("playbackObject").pause();
		},

		stop: function() {
			this.get("playbackObject").end();
		},

		// Observers
		bpmChanged: function() {
			this.scheduler.setTempo(this.get("bpm"));
		}.observes("bpm")
	});

	return Scheduler;
});