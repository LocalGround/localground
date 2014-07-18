define(
	[
		"lib/external/backbone-min",
		"config",
		"models/project",
		"collections/projects",
		
	], function(Backbone, Config, Project, Projects) {
	var DataManager = function() {
		this.collections = {};
		this.projects = new Projects();
		this.fetchProjects = function(){
			this.projects.fetch({ reset: true, async: false})
		};
		
		this.fetchDataByProjectID = function(id) {
			var that = this;
			var project = new Project({id: id});
			project.fetch({data: {format: 'json'}, success: function(r){
				that.updateCollections(project);
			}});
		};
		
		this.getCollection = function(key) {
			return this.collections[key];
		};
		
		this.updateCollections = function(project) {
			//add child data to the collection:
			var children = project.get("children");
			for (key in children) {
				var opts = Config[key.split("_")[0]];
				var models = [];
				$.each(children[key].data, function(){
					models.push(new opts.Model(this));
				});
				this.updateCollection(key, models, opts);
			}
			
			//add new project to the collection:
			this.projects.add(project, {merge: true});
		};
		
		this.updateCollection = function(key, models, opts) {
			if (this.collections[key] == null) {
				this.collections[key] = new opts.Collection(models);
			}
			this.collections[key].add(models, {merge: true});
		};
	};
	return DataManager;
});
