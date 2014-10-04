define([
	"./pattern",
	"../fastCollection"
], function (
	Pattern,
	FastCollection
) {

	// The sequencer should always be associated with a pattern model (maybe?)
	// The sequencer should always be associated with an Instrument object.

	var Sequencer = Ember.Object.extend({
		// How on earth are we going to render this shit?
		playing: false,
		steps: 16,
		step: 0,
		name: "Sequencer Derp",
		instrument: null,

		currentlyPlayingNotes: null,
		pattern: null,

		playbackObject: null,

		init: function () {
			this._super();

			// stuff here
			this.currentlyPlayingNotes = Ember.ArrayController.create();

			console.log("sequencer", this.get("pattern"));

			// Notes should be pattern, yeah?  I reckon.
			// Then pattern can be FastCollection YEAH BABY
			this.set("pattern", Pattern.create({
				items: this.get("pattern") || null
			}));
		},

		changePlaying: function() {
			var self = this;

			if (this.get("playing")) {
				// The callback describes how to move the steps forward to the scheduler
				App.state.scheduler.play([], {
					callback: function() {
						var step = self.get("step");
						var reset = (step === self.get("steps") - 1);
						var next = reset ? 0 : step + 1;

						self.set("step", next);
					}
				});
			}
			else {
				this.currentlyPlayingNotes.forEach(function(item) {
					item.noteOff();
				});
				this.currentlyPlayingNotes.clear();
				App.state.scheduler.stop();
			}
		}.observes("playing"),

		play: function() {
			var self = this;

			// The callback describes how to move the steps forward to the scheduler
			var playback = App.state.scheduler.play([], {
				callback: function() {
					var step = self.get("step");
					var reset = (step === self.get("steps") - 1);
					var next = reset ? 0 : step + 1;

					self.set("step", next);

					if (reset) playback.end();
				},
				steps: self.get("steps"),
				repeat: 1
			});

			console.log("play", playback);

			this.set("playbackObject", playback);
		},

		stop: function() {
			this.get("playbackObject").end();
		},

		changeStep: function() {
			var self = this;

			var playingNotes = this.get("currentlyPlayingNotes").map(function(item) {
				if (item.get("position") + item.get("duration") <= self.get("step")) {
					item.noteOff();
					return item;
				}
			});

			if (playingNotes.get("length")) {
				this.get("currentlyPlayingNotes").removeObjects(playingNotes);
			}

			// Change Step filters through Point objects
			// Then it gets out the note from each step and feeds it to the instrument
			var currentNotes = this.get("pattern.items").getByProperty("position", this.get("step"));
			if (currentNotes.get("length")) {
				console.log("currentNotes", currentNotes);
				this.get("currentlyPlayingNotes").addObjects(currentNotes);
				self.instrument.playNotes(currentNotes);
			}
		}.observes("step")
	});

	return Sequencer;
});