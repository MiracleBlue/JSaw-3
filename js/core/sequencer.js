define([

], function (

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
		points: null,
		playing: false,
		rows: null,
		steps: 16,
		step: 0,
		name: "Sequencer Derp",
		instrument: null,

		init: function () {
			this._super();

			// stuff here
			this.points = Points.create();

			var self = this;

			this.rows.forEach(function (row) {
				// Create a new row... I guess.

				var points = Points.create();
				row.set("points", points);

				for (var i = 0; i < self.get("steps"); i++) {
					var point = points.addObject(Point.create({
						row: row,
						step: i
					}));
					// Cache it
					self.points.addObject(point); // For caching purposes only.
				}
			});
		},

		addNote: function(note, step) {
			// Okay this looks up the point at said step, and the row that the note should be on.
			var lookupString = note.get("latin");
			var self = this;
			var row = this.rows.findProperty("latin", lookupString);
			var point = row.points.findProperty("step", step);
			point.set("note", note); // I think this will work.
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
				App.state.scheduler.stop();
			}
		}.observes("playing"),

		changeStep: function() {
			var self = this;
			// Change Step filters through Point objects
			// Then it gets out the note from each step and feeds it to the instrument
			var filteredSteps = this.points.filter(function(item) {
				return (item.get("step") === self.get("step") && item.get("note"));
			});
			_(filteredSteps).each(function(item) {
				self.instrument.playNotes(item.get("note"));
			});
		}.observes("step")
	});

	return Sequencer;
});