define([
	"../base/BaseComponent",
	"./SuperGridView"
], function (BaseComponent, SuperGridView) {
	return BaseComponent.extend({
		mainViewClass: SuperGridView,
		init: function () {
			this._super();

			// stuff here
		}
	});
});