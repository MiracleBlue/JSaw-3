define(function() {
	var FastCollection = Ember.ArrayController.extend({
		memoizeKey: "position",
		lookupCache: {},
		init: function() {
			this._super();

			console.log("collection", this.get("content"));

			this.updateCache();
		},
		changeListener: function() {
			console.log("change occurred!");

			this.updateCache();
		}.observes("content.@each"),
		updateCache: function() {
			var memoizeKey = this.get("memoizeKey");
			var newCache = {};
			this.get("content").forEach(function(item) {
				var memoizeValue = item[memoizeKey];
				if (!newCache[memoizeValue]) {
					newCache[memoizeValue] = [];
				}
				newCache[memoizeValue].push(item);
			});
			this.set("lookupCache", newCache);
		},
		getItem: function(keyValue) {
			// Should make this the fastest ever get-by-property-value.
			return this.get("lookupCache")[keyValue];
		}
	});

	window.FastCollection = FastCollection;

	return FastCollection;
});