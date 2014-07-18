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
		this.selectedProjects = new Projects();
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
		
		this.removeDataByProjectID = function(id){
			//http://backbonejs.org/#Collection-remove
			for (key in this.collections) {
				var collection = this.collections[key];
				var items = [];
				collection.each(function(item) {
					if (item.get("project_id") == id) {
						items.push(item);
					}
				}, this);
				
				//remove items from the collection:
				this.collections[key].remove(items);
			}
			
			//remove selected project:
			this.selectedProjects.remove({id: id});
		};
		
		this.getCollection = function(key) {
			return this.collections[key];
		};
		
		this.updateCollections = function(project) {
			//add child data to the collection:
			var children = project.get("children");
			for (key in children) {
				var opts = Config[key.split("_")[0]];
				opts.name = children[key].name;
				var models = [];
				$.each(children[key].data, function(){
					models.push(new opts.Model(this));
				});
				this.updateCollection(key, models, opts);
			}
			
			//add new project to the collection:
			this.selectedProjects.add(project, {merge: true});
		};
		
		this.updateCollection = function(key, models, opts) {
			if (this.collections[key] == null) {
				this.collections[key] = new opts.Collection(models);
				if (key.indexOf("form") != -1) {
					this.collections[key].name = opts.name;
				}
			}
			this.collections[key].add(models, {merge: true});
		};
	};
	return DataManager;
});
