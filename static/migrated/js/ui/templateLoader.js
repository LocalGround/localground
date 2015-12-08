////coenraets.org/blog/2012/01/backbone-js-lessons-learned-and-improved-sample-app/
localground.Templates = (function(){
	var templates = {};
	var templatesDir = '/static/migrated/js/templates/';
 
    // Recursively pre-load all the templates for the app.
    // This implementation should be changed in a production environment:
    // All the template files should be concatenated in a single file.
    this.loadTemplates = function(names, callback) {
        var loadTemplate = function(index) {
            var name = names[index];
            console.log('Loading template: ' + name);
            $.get(templatesDir + name + '.html', function(data) {
                templates[name] = data;
                index++;
                if (index < names.length) {
                    loadTemplate(index);
                } else {
                    callback();
                }
            });
        };
        loadTemplate(0);
    };
 
    // Get template by name from hash of preloaded templates
    this.get = function(name) {
        return templates[name];
    };
});
