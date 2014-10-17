Ember.Handlebars.helper('method', function(obj, name) {
	var args = Array.prototype.splice.call(arguments, 2, arguments.length - 1);

	var returnedView = obj[name].apply(obj, args);
	//if (returnedView) return Ember.Handlebars.helpers.view.call(this, returnedView);
	var options = args[args.length - 1];

	if (returnedView) {
		console.log("method", options, returnedView);
	}
	//if (returnedView) return returnedView;
	if (returnedView) return Ember.Handlebars.ViewHelper.helper(this, returnedView, args[args.length - 1]);
	//if (returnedView) return Ember.Handlebars.ViewHelper.helper(this, App.views.thing, args[args.length - 1]);
});