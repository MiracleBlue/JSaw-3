define([
	"./pattern",
	"../fastCollection",
	"./midi/midinote"
], function (
	Pattern,
	FastCollection,
	MidiNote
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
		track: null,

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
			if (!this.get("pattern.steps")) {
				this.set("pattern", Pattern.create({
					items: this.get("pattern") || null
				}));
			}


			var self = this;

			var scheduler = this.get("scheduler") || App.state.scheduler;

			scheduler.on("play", function() {
				self.set("playing", true);
			});
			scheduler.on("pause", function() {
				self.stop();
			});
			scheduler.on("stop", function() {
				self.stop();
			});
			scheduler.on("changeStep", function(step) {
				self.set("step", step);
				self.playStep(step);
			});
		},

		stop: function() {
			this.set("playing", false);
			this.get("currentlyPlayingNotes").invoke("noteOff");
			this.get("currentlyPlayingNotes").clear();
		},

		playStep: function(step) {
			var self = this;

			var playingNotes = this.get("currentlyPlayingNotes").map(function(item) {
				if (item.get("position") + item.get("duration") <= step) {
					item.noteOff();
					return item;
				}
			});

			if (playingNotes.get("length")) {
				this.get("currentlyPlayingNotes").removeObjects(playingNotes);
			}

			// Change Step filters through Point objects
			// Then it gets out the note from each step and feeds it to the instrument
			var currentNotes = this.get("pattern.items").getByProperty("position", step);
			if (currentNotes.get("length")) {
				console.log("currentNotes", currentNotes);
				this.get("currentlyPlayingNotes").addObjects(currentNotes);
				self.track.instrument.playNotes(currentNotes);
			}
		}
	});

	return Sequencer;
});