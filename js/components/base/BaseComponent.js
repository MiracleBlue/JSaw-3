define([
	"./BaseView"
], function (BaseView) {
	return Ember.Object.extend({
		mainViewClass: BaseView,
		mainView: null,
		init: function () {
			this._super();

			// stuff here
		},
		restartView: function() {
			this.set("mainView", this.get("mainViewClass").create({
				controller: this
			}));
			return this.get("mainView");
		}
	});
});