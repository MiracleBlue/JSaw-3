define([

], function(

) {
	return Ember.Object.extend(Ember.Evented, {
		midiNote: null,
		node: null,

		frequency: null,
		sustain: 1,
		attack: 0.51,
		decay: 0.15,
		release: 0.21,

		init: function() {
			this._super();

			this.node = App.createAudioNode(0, 1);

			this.build();
			this.route();
		},

		build: function() {
			var self = this;

			this.saw = new Saw(App.audiolet, this.midiNote.get("frequency"));
			this.gain = new Gain(App.audiolet);

			// The sustain is set to 1 so that the release stage will not trigger until the gate is closed, which happens at noteOff
			this.envelope = new ADSREnvelope(App.audiolet, 1, this.get("attack"), this.get("decay"), this.get("sustain"), this.get("release"), function() {
				self.trigger("complete");
			});

			// This bit is absolutely required in order for things to work properly.
			this.midiNote.on("noteOff", function() {
				// This sets the envelope state to release
				self.envelope.gate.setValue(0);
			});
		},

		route: function() {
			this.envelope.connect(this.gain, 0, 1);
			this.saw.connect(this.gain);
			this.gain.connect(this.node.outputs[0]);
			console.log(this.envelope);
		}
	});
});