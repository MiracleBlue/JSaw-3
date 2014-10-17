define([
	// Libraries
	"./vendor/note", // NoteLib
	"./core/midi/midinote", // MidiNote
	"./core/scheduler", // Scheduler
	"./core/sequencer",
	"./core/track",
	"./core/pattern",
	"./components/supergrid/SuperGrid",
	"./instruments/default-sawtooth/DefaultSawtooth",
	"./fastCollection"
], function(
	NoteLib,
	MidiNote,
	Scheduler,
	Sequencer,
	Track,
	Pattern,
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
		tracks: null,
		playlist: null,
		mixer: null,
		scheduler: null,

		init: function() {
			this._super();
			// Do stuff here
			var self = this;

			this.scheduler = Scheduler.create({
				audiolet: App.audiolet
			});

			this.set("instruments", Ember.ArrayController.create({
				content: [
					DefaultSawtooth.create()
				]
			}));

			this.set("tracks", Ember.ArrayController.create({
				content: [
					Track.create({
						instrument: self.get("instruments").objectAt(0)
					})
				]
			}));

			this.set("patterns", FastCollection.create({
				content: [
					Pattern.create({
						items: [
							MidiNote.create({key: "A", duration: 4, position: 2}),
							MidiNote.create({key: "C", duration: 4, position: 2}),
							MidiNote.create({key: "C", duration: 1, position: 8}),
							MidiNote.create({key: "F", duration: 1, position: 9})
						]
					})
				]
			}));

			this.set("playlist", FastCollection.create({
				content: [
					Sequencer.create({
						scheduler: self.get("scheduler"),
						track: self.get("tracks").objectAt(0),
						pattern: self.get("patterns").objectAt(0)
					})
				]
			}))
		}
	});

	var Key = Ember.Object.extend({
		// Some of the extra properties are redundant here so might be removed later on
		name: "A",
		octave: 3,
		points: null, // reserved for storing the list of steps in this row's matrix, useless now
		// computed
		latin: function() {
			return (this.get("name").capitalize() + this.get("octave"));
		}.property("name", "octave"),
		frequency: function() {
			return App.NoteLib.fromLatin(this.get("key").capitalize() + this.get("octave")).frequency();
		}.property("key", "octave")
	});

	var keys = Ember.ArrayController.create({
		// Stuff might go here one day.
		content: [
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
		]
	});

	window.App = Ember.Application.create({
		audiolet: null,

		NoteLib: NoteLib,

		MidiNote: MidiNote,

		state: null,

		views: null,

		createAudioNode: function(numInputs, numOutputs) {
			var audioNode = function(audiolet) {
				AudioletGroup.apply(this, [audiolet, numInputs, numOutputs]);
			};
			extend(audioNode, AudioletGroup);

			return new audioNode(this.get("audiolet"));
		},

		MainView: Ember.View.extend({
			init: function() {
				this._super();

				App.set("audiolet", new Audiolet());
				App.set("state", ApplicationState.create());
				App.set("views", {
					pianoRoll: SuperGrid.create({
						rows: keys,
						sequencer: Sequencer.create({
							instrument: DefaultSawtooth.create(),
							pattern: [
								MidiNote.create({key: "A", duration: 4, position: 2}),
								MidiNote.create({key: "C", duration: 4, position: 2}),
								MidiNote.create({key: "C", duration: 1, position: 8}),
								MidiNote.create({key: "F", duration: 1, position: 9})
							]
						})
					})
				});

				window.testSequencer = App.views.pianoRoll.sequencer;

				console.log(this);
				//this.restartView();
				App.views.pianoRoll.restartView();
			},
			classNames: ["derp"],
			restartView: function() {
				this.rerender();
			},
			template: Ember.Handlebars.compile("<h1>Hello!</h1><div id='content'>{{view App.views.pianoRoll.mainView}}</div>")
		})
	});

	//console.log(testSequencer);

	//App.Instrument.playNotes(testNote);

	setTimeout(function() {
		//testNote.noteOff();
	}, 1000);

	console.log($("#content"));



});
