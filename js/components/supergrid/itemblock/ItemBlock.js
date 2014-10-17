define(["../../base/BaseComponent", "./ItemBlockView"], function(BaseComponent, ItemBlockView) {
	return BaseComponent.extend({
		grid: null,
		viewModel: null,
		mainViewClass: ItemBlockView
	})
})