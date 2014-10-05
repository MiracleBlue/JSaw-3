define([
	"generator"
], function(
	Generator
) {
	return Ember.Object.extend(Ember.Evented, {
		generator: Generator,
		node: null,

		init: function() {
			this._super();

			this.createAudioNode();

			//this.generator = Generator;
			this.get("node").connect(App.get("audiolet").output);
		},

		createAudioNode: function() {
			this.node = App.createAudioNode(0, 1);
		},

		playNotes: function(notes) {
			var self = this;

			if (!_.isArray(notes)) {
				notes = [notes];
			}

			_(notes).each(function(note) {
				var voice = self.generator.create({
					midiNote: note
				});

				voice.on("complete", function() {
					voice.node.disconnect(self.node.outputs[0]);
					console.log("voice disconnected");
				});

				voice.node.connect(self.node.outputs[0]);
			});

		}
	});
});