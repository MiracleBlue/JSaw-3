define(["../fastCollection"], function(FastCollection) {
	return Ember.Object.extend({
		patterns: null,
		instrument: null,

		init: function() {
			this._super();
			this.set("patterns", FastCollection.create({
				content: this.get("patterns") || []
			}));
		}
	});
});