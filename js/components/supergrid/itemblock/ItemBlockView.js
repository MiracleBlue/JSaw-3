define([
	"text!./templates/ItemBlockTemplate.hbs"
], function (ItemBlockTemplate) {
	return Ember.View.extend({
		classNames: ["item-block-view"],
		init: function () {
			this._super();

			// stuff here
			console.log("ItemBlockView created");
		},
		template: Ember.Handlebars.compile(ItemBlockTemplate)
	});
});