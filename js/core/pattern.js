define(["../fastCollection"], function(FastCollection) {
	return Ember.Object.extend(Ember.Evented, {
		steps: 16,
		track: 0,
		position: 0,
		items: null,
		name: "Some Pattern",

		init: function() {
			this._super();

			var fc = FastCollection.create({
				content: this.get("items") || []
			});
			this.set("items", fc);

			console.log("pattern", this.get("items"));
		},
		addNotes: function(notes) {
			this.get("items").addObjects(notes);
			return this;
		},
		removeNotes: function(notes) {
			this.get("items").removeObjects(notes);
			return this;
		}
	});
});