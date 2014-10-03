define([
	"text!./templates/SuperGridTemplate.hbs"
], function (SuperGridTemplate) {
	return Ember.View.extend({
		init: function () {
			this._super();

			// stuff here
			console.log("SuperGridView created");
		},
		template: Ember.Handlebars.compile(SuperGridTemplate)
	});
});