define(function() {
	return Ember.Object.extend({
		patterns: null,
		instrument: null,

		init: function() {
			this._super();
			this.set("patterns", Ember.ArrayController.create());
		}
	})
})