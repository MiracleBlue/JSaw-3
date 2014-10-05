define([
	"../base/BaseComponent",
	"./SuperGridView"
], function (BaseComponent, SuperGridView) {

	return BaseComponent.extend({
		mainViewClass: SuperGridView,
		steps: 16,
		rows: null,
		// todo: refactor so this isn't tied to "patterns"
		sequencer: null,
		junkStepArray: null,
		init: function () {
			this._super();

			// stuff here
			this.updateJunkStepArray();
		},
		// This junkStepArray is a dumb hack to replace a "times" method in handlebars
		// beacuse Ember refuses to implement bound block helpers because REASONS or something.
		updateJunkStepArray: function() {
			var jsa = [];
			for (var i = 0; i < this.get("steps"); i++) {
				jsa.push(i);
			}
			this.set("junkStepArray", jsa);
		}.observes("steps"),

		test: function(val) {
			return "Hello: " + val;
		},

		lookupItems: function(step, latin) {
			var filteredItems = this.get("sequencer.pattern.items").getByProperty("position", step);
			filteredItems = filteredItems.filter(function(item) {
				if (item.get("latin") == latin) return true;
			});
			//return filteredItems;
			if (filteredItems.length) {
				return "<strong>NOTE</strong> ";
			}
			else return "";
		},

		actions: {
			playPause: function() {
				console.log("playPause");
				console.log("playPause", this.get("steps"));
			}
		}
	});
});