define([
	"text!./templates/ItemBlockTemplate.hbs"
], function (ItemBlockTemplate) {
	return Ember.View.extend({
		classNames: ["item-block-view"],
		classNameBindings: ['controller.playing'],
		attributeBindings: ["style"],
		pixelWidth: 50,
		style: function() {
			return "width: " + ((this.get("controller.duration") * this.get("pixelWidth")) - 1) + "px;";
		}.property("pixelWidth", "controller.duration"),
		init: function () {
			this._super();

			// stuff here
			console.log("ItemBlockView created");
		},
		template: Ember.Handlebars.compile(ItemBlockTemplate)
	});
});