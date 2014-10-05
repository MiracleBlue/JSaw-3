Ember.Handlebars.helper('method', function(obj, name) {
	var args = Array.prototype.splice.call(arguments, 2, arguments.length - 1);

	return new Ember.Handlebars.SafeString(obj[name].apply(obj, args));
});