define([
	"./BaseView"
], function (BaseView) {
	return Ember.ObjectController.extend({
		mainViewClass: BaseView,
		mainView: null,
		init: function () {
			this._super();

			// stuff here
			this.restartView();
		},
		restartView: function() {
			this.set("mainView", this.get("mainViewClass").create({
				controller: this.get("viewModel") || this
			}));
			return this.get("mainView");
		}
	});
});