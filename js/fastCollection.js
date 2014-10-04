define(function() {
	var FastCollection = Ember.ArrayController.extend(Ember.Evented, {
		enableObserver: true,
		lookupCache: {},
		init: function() {
			this._super();

			this.updateCache();
		},
		changeListener: function() {
			if (this.enableObserver) this.updateCache();
		}.observes("content.@each"),
		updateCache: function() {
			var newCache = {};

			this.get("content").forEach(function(item) {
				var keys = Object.keys(item);
				keys.forEach(function(memoizeKey) {
					var memoizeValue = item[memoizeKey];
					if (!newCache[memoizeKey]) newCache[memoizeKey] = {};

					if (typeof memoizeValue === "number" || typeof memoizeValue === "string") {
						if (!newCache[memoizeKey][memoizeValue]) {
							newCache[memoizeKey][memoizeValue] = [item];
						}
						else newCache[memoizeKey][memoizeValue].push(item);
					}

				});

			});
			this.set("lookupCache", newCache);

			this.trigger("collectionUpdated");
			console.log("FC", this.get("lookupCache"), this.get("content"));
		},
		getByProperty: function(key, value) {
			// Should make this the fastest ever get-by-property-value.
			return this.get("lookupCache")[key][value] || [];
		}
	});

	return FastCollection;
});