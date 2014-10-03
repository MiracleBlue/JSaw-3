define(function() {
	return Ember.Object.extend(Ember.Evented, {
		// This object is designed to be created when a note is sequenced.
		// It is then sent to an instrument by a sequencer and that sequencer triggers "noteOn",
		// Which the instrument listens to and uses to know when it's supposed to play the note.
		// and according to this note's duration, the sequencer will tell it when to "noteOff",
		// at which point the instrument will kill the gate and remove this note from its references.
		key: "C",
		octave: 3,
		velocity: 1,
		duration: 1,
		position: 0,
		frequency: function() {
			return App.NoteLib.fromLatin(this.get("key").capitalize() + this.get("octave")).frequency();
		}.property("key", "octave"),
		latin: function() {
			return this.get("key").capitalize() + this.get("octave");
		}.property("key", "octave"),
		init: function() {
			this._super();
			//console.log(this.get("key"));
			//console.log(this.key);
			console.log(this.getProperties("key", "octave", "velocity", "position","duration"));
		},
		noteOn: function() {
			this.trigger("noteOn");
		},
		noteOff: function() {
			this.trigger("noteOff");
		}
	});
});