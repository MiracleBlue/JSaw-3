define([
	// Libraries
	"./vendor/note", // NoteLib
	"./core/midi/midinote", // MidiNote
	"./core/scheduler", // Scheduler
	"./core/sequencer",
	"./components/supergrid/SuperGrid",
	"./instruments/default-sawtooth/DefaultSawtooth",
	"./fastCollection"
], function(
	NoteLib,
	MidiNote,
	Scheduler,
	Sequencer,
	SuperGrid,
	DefaultSawtooth,
	FastCollection
) {
	var ObjectCollection = Ember.ArrayController.extend({

	});

	var ApplicationState = Ember.Object.extend({
		bpm: 130,
		instruments: null,
		patterns: null,
		playlist: null,
		mixer: null,
		scheduler: null,

		init: function() {
			this._super();
			// Do stuff here

			this.scheduler = Scheduler.create({
				audiolet: App.audiolet
			});
		}
	});

	var Key = Ember.Object.extend({
		// Some of the extra properties are redundant here so might be removed later on
		name: "A",
		octave: 3,
		points: null, // reserved for storing the list of steps in this row's matrix
		// computed
		latin: function() {
			return (this.get("name").capitalize() + this.get("octave"));
		}.property("name", "octave"),
		frequency: function() {
			return App.NoteLib.fromLatin(this.get("key").capitalize() + this.get("octave")).frequency();
		}.property("key", "octave")
	});

	var Keys = Ember.ArrayController.extend({
		// Stuff might go here one day.
	});

	window.App = Ember.Application.create({
		audiolet: new Audiolet(),

		NoteLib: NoteLib,

		MidiNote: MidiNote,

		state: null,

		createAudioNode: function(numInputs, numOutputs) {
			var audioNode = function(audiolet) {
				AudioletGroup.apply(this, [audiolet, numInputs, numOutputs]);
			};
			extend(audioNode, AudioletGroup);

			return new audioNode(this.get("audiolet"));
		},

		SuperGrid: SuperGrid.create(),

		MainView: Ember.View.extend({
			init: function() {
				this._super();

				console.log(this);
				//this.restartView();
				App.SuperGrid.restartView();
			},
			classNames: ["derp"],
			restartView: function() {
				this.rerender();
			},
			template: Ember.Handlebars.compile("<h1>Hello!</h1><div id='content'>{{view App.SuperGrid.mainView}}</div>")
		})
	});

	App.state = ApplicationState.create();

	App.Instrument = DefaultSawtooth.create({

	});

	var testRows = Keys.create();
	testRows.addObjects([
		Key.create({
			name: "C",
			octave: 3
		}),
		Key.create({
			name: "C#",
			octave: 3
		}),
		Key.create({
			name: "D",
			octave: 3
		}),
		Key.create({
			name: "D#",
			octave: 3
		}),
		Key.create({
			name: "E",
			octave: 3
		}),
		Key.create({
			name: "F",
			octave: 3
		}),
		Key.create({
			name: "F#",
			octave: 3
		}),
		Key.create({
			name: "G",
			octave: 3
		}),
		Key.create({
			name: "G#",
			octave: 3
		}),
		Key.create({
			name: "A",
			octave: 3
		}),
		Key.create({
			name: "B",
			octave: 3
		})
	]);

	window.testRows = testRows;

	window.testSequencer = Sequencer.create({
		instrument: App.Instrument,
		pattern: [
			MidiNote.create({key: "A", duration: 4, position: 2}),
			MidiNote.create({key: "C", duration: 4, position: 2}),
			MidiNote.create({key: "C", duration: 1, position: 8}),
			MidiNote.create({key: "F", duration: 1, position: 9}),
		]
	});

	console.log(testSequencer);

	App.Instrument.node.connect(App.audiolet.output);

	//App.Instrument.playNotes(testNote);

	setTimeout(function() {
		//testNote.noteOff();
	}, 1000);

	console.log($("#content"));



});
