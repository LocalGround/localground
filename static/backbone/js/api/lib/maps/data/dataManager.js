define(
	[
		"backbone",
		"models/project",
		"collections/projects",,
		"config"
		
	], function(Backbone, Project, Projects) {
	/**
	 * The map DataManager class separates the temporary data
	 * storage (data retrieved from various Local Ground Data
	 * API queries) from the different map views that consume
	 * this data.
	 * @class DataManager
	 */
	localground.maps.data.DataManager = function(sb) {
		/**
		 * A dictionary of the various data types available (given
		 * the projects that have been selected), and the corresponding
		 * data records that have been pulled down from the Data API.
		 */
		this.collections = {};
		/**
		 * A list of all of the user's available projects
		 */
		this.projects = new Projects();
		/**
		 * The projects that are currently loaded in
		 * corresponding map views.
		 */
		this.selectedProjects = new Projects();
		
		this.initialize = function(sb) {
			this.sb = sb;
			this.sb.listen({ 
                "load-projects": this.fetchProjects,
				"project-requested": this.fetchDataByProjectID,
				"project-removal-requested": this.removeDataByProjectID,
				"set-active-project": this.setActiveProject,
				"marker-added": updateCollection
			});
			
			this.restoreState();
		};
		
		/**
		 * Fetches the user's available projects from the data API.
		 */
		this.fetchProjects = function(){
			var that = this;
			this.projects.fetch({
				reset: true,
				success: function(){
					that.sb.notify({
						type : "projects-loaded",
						data: {projects: that.projects}
					});
				}
			});
		};
		
		/**
		 * Fetches a particular project from the data API.
		 * @param {Integer} id
		 * The id of the project of interest.
		 */
		this.fetchDataByProjectID = function(data) {
			var that = this;
			this.sb.setActiveProjectID(data.id);
			var project = new Project({id: data.id});
			project.fetch({data: {format: 'json', include_schema: true}, success: function(r){
				that.updateCollections(project);
			}});
		};
		
		/**
		 * Removes project data from memory (which subsequently
		 * removes this data from the views which are bound to
		 * the data).
		 * @param {Integer} id
		 * The id of the project of interest.
		 */
		this.removeDataByProjectID = function(data){
			//http://backbonejs.org/#Collection-remove
			for (key in this.collections) {
				var collection = this.collections[key];
				var items = [];
				collection.each(function(item) {
					if (item.get("project_id") == data.id) {
						items.push(item);
					}
				}, this);
				
				//remove items from the collection:
				this.collections[key].remove(items);
			}
			
			//remove selected project:
			this.selectedProjects.remove({id: data.id});
			
			//reset default project:
			this.resetActiveProject();
			
			//notify the rest of the application
			this.sb.notify({
				type : "selected-projects-updated",
				data: {projects: this.selectedProjects}
			});
			
			this.saveState();
		};
		
		this.resetActiveProject = function(){
			this.sb.setActiveProjectID(-1);
			var that = this;
			this.selectedProjects.each(function(model) {
				that.sb.setActiveProjectID(model.id);
			});
		}
		
		/**
		 * Because projects have many different types of data
		 * associated with them (which must all be treated slightly
		 * differently), each type of data is locally stored in its
		 * own collection. See config.js to view the various data
		 * types associated with a particular project. The config
		 * file coordinates between the data stored in the API, and
		 * the backbone data structures that manipulate this data.
		 * @param {String} key
		 * The key refers to the object_type of the data of interest.
		 */
		this.getCollection = function(key) {
			return this.collections[key];
		};
		
		/**
		 * Coordinates data pulled down from the data API
		 * with the local Backbone collections being stored
		 * and manipulated in memory.
		 * @method updateCollections
		 * @param {Project} project
		 * A project detail data structure returned from the
		 * Local Ground data API.
		 */
		this.updateCollections = function(project) {
			//add child data to the collection:
			var children = project.get("children");
			for (var key in children) {
				var models = [];
				var configKey = key.split("_")[0];
				var opts = localground.config.Config[configKey];
				$.each(children[key].data, function(){
					models.push(new opts.Model(this, {
						updateMetadata: children[key].update_metadata
					}));
				});
				
				$.extend(opts, {
					name: children[key].name,
					createMetadata: children[key].create_metadata,
					key: key,
					models: models
				});
				//"call" method needed to set this's scope:
				updateCollection.call(this, opts);
			}
			//add new project to the collection:
			this.selectedProjects.add(project, {merge: true});
			this.sb.notify({
				type : "selected-projects-updated",
				data: {projects: this.selectedProjects}
			});
			this.saveState();
		};
		
		/**
		 * Helper function that files Backbone models into their
		 * appropriate Backbone collection
		 * @method updateCollections
		 * @param {String} key
		 * @param {Array} models
		 * A list of Backbone models
		 * @param {Object} opts
		 * An object that tells the function which collection
		 * type to instantiate, and the name of the collection
		 */
		var updateCollection = function(opts) {
			if (opts == null) {
				//todo: create standardized way to report errors (prob. via CORE).
				alert("Error in \"DataManager's updatedCollection\" function: opts argument cannot be null.");
				return;
			}
			var key = opts.key;
			var models = opts.models;
			var configKey = opts.key.split("_")[0];
			//opts = opts || localground.config.Config[configKey];
			if (this.collections[key] == null) {
				var collectionOpts = { key: key, name: opts.name };
				//A few special hacks for form data:
				if (key.indexOf("form") != -1) {
					collectionOpts.url = '/api/0/forms/' + key.split("_")[1] + '/data/';
				}
				this.collections[key] = new opts.Collection([], collectionOpts);
				
				// important: this trigger enables the overlayManager
				// to create a new overlay for each model where the
				// GeoJSON geometry is defined.
				this.sb.notify({
					type : "new-collection-created",
					data : { collection: this.collections[key] } 
				});
				
			}
			this.collections[key].add(models, {merge: true});
		};
		
		this.setActiveProject = function(data){
			this.sb.setActiveProjectID(data.id);
			this.saveState();
		};
		
		this.saveState = function(data){
			var ids = [];
			this.selectedProjects.each(function(model){
				ids.push(model.id);	
			});
			this.sb.saveState({
				projectIDs: ids,
				defaultProjectID: this.sb.getActiveProjectID()
			});
		};
		
		this.restoreState = function(){
			var state = this.sb.restoreState();
			if (state == null) { return; }
			for(var i=0; i < state.projectIDs.length; i++){
				this.fetchDataByProjectID({ id: state.projectIDs[i] });
			};
			// check to make sure the default project exists in the active list:
			var projIndex = state.projectIDs.indexOf(state.defaultProjectID);
			// if it doesn't, set the projIndex to the last active project in the list:
			if (projIndex == -1)
				projIndex = state.projectIDs.length - 1;
			this.sb.setActiveProjectID(state.projectIDs[projIndex]);
		};
		
		this.initialize(sb);
	};
	localground.maps.data.DataManager.prototype.destroy = function() {
		alert("todo: implement");
	};
	return localground.maps.data.DataManager;
});
