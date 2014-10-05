define(["../fastCollection"], function(FastCollection) {
	return Ember.Object.extend({
		patterns: null,
		instrument: null,

		init: function() {
			this._super();
			this.set("patterns", FastCollection.create({
				content: this.get("patterns") || []
			}));
		},

		addPatterns: function(patterns) {
			this.get("patterns").addObjects(patterns);
			return this;
		},
		removePatterns: function(patterns) {
			this.get("patterns").removeObjects(patterns);
			return this;
		}
	});
});