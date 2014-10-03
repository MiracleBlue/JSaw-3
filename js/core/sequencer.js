define([
	"./pattern"
], function (
	Pattern
) {
	var Point = Ember.Object.extend({
		row: null,
		step: null,
		note: null
	});

	var Points = Ember.ArrayController.extend({

	});



	var RowsCollection = Ember.ArrayController.extend({
		// Something could go in here I guess
	});

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
		notes: null,

		init: function () {
			this._super();

			// stuff here
			this.currentlyPlayingNotes = Ember.ArrayController.create();
			this.notes = Ember.ArrayController.create();

			var self = this;

			for (var i = 0; i < this.get("steps"); i++) {
				this.notes.addObject(Ember.ArrayController.create());
			}
		},

		addNote: function(note) {
			// Okay this looks up the point at said step, and the row that the note should be on.
			var lookupString = note.get("latin");
			var self = this;
			//var row = this.rows.findProperty("latin", lookupString);
			//var point = row.points.findProperty("step", note.get("position"));
			//point.set("note", note); // I think this will work.

			this.notes.objectAt(note.get("position")).addObject(note);
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
		},

		changeStep: function() {
			var self = this;

			var playingNotes = this.currentlyPlayingNotes.map(function(item) {
				if (item.get("position") + item.get("duration") <= self.get("step")) {
					console.log("noteOff", item);
					item.noteOff();
					return item;
				}
			});



			//this.set("currentlyPlayingNotes", playingNotes);

			if (playingNotes.get("length")) {
				this.currentlyPlayingNotes.removeObjects(playingNotes);
				console.log("playingNotes", playingNotes);
			}
			// Change Step filters through Point objects
			// Then it gets out the note from each step and feeds it to the instrument
			var currentNotes = this.notes.objectAt(this.get("step"));
			if (currentNotes.get("length")) {
				console.log("currentNotes", currentNotes);
				this.currentlyPlayingNotes.addObjects(currentNotes);
				currentNotes.forEach(function(item) {
					self.instrument.playNotes(item);
				});
			}
		}.observes("step")
	});

	return Sequencer;
});