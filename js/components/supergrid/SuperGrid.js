define([
	"../base/BaseComponent",
	"./SuperGridView",
	"./itemblock/ItemBlock"
], function (BaseComponent, SuperGridView, ItemBlock) {

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
				// Use object instead of standard number to get around the handlebars context bug
				jsa.push({
					value: i
				});
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
				//console.log("filteredItem", filteredItems[0]);

				var noteView = ItemBlock.create({
					viewModel: filteredItems[0]
				});
				return noteView.get("mainView");
			}
			return false;
		},

		actions: {
			playPause: function() {
				if (!App.state.scheduler.get("playing")) App.state.scheduler.play();
				else App.state.scheduler.pause();
				console.log("playPause");
				console.log("playPause", this.get("steps"));
			},
			toggleItem: function(step, row) {
				console.log("addItem", arguments);
			}
		}
	});
});