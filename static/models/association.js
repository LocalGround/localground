define(["models/base"], function (Base) {
	"use strict";
	/**
	 * A Backbone Model class for the marker association datatype.
	 * @class Association
	 * @see <a href="//localground.org/api/0/markers/">//localground.org/api/0/markers/</a>
	 */
	var Association = Base.extend({
		initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);
            /*
            Required:
            model: model to which media is to be attached
            attachmentType: type of attached media ("photos" or "audio")
            attachmentID: attached media id (OPTIONAL)
            */
			console.log(data);
            var model = data.model,
                attachmentType = data.attachmentType,
                attachmentID = data.attachmentID,
                formID;
            if (!model) {
                console.error("Association requires a 'model' argument.");
                return false;
            }
            if (!attachmentType) {
                console.error("Association requires a 'attachmentType' argument.");
                return false;
            }
            //todo: API change needed to make the model.id param not "id" but object_id.
			if (model.get("overlay_type") === "marker") {
	            this.urlRoot = '/api/0/markers/' + model.id + '/' + attachmentType + '/';
			} else if (model.get("overlay_type").indexOf("form_") != -1) {
                formID = model.get("overlay_type").split("_")[1];
                this.urlRoot = '/api/0/datasets/' + formID + '/data/' + model.id + "/" + attachmentType + '/';
			}
            if (attachmentID) {
                this.idAttribute = 'object_id';
                this.set("object_id", attachmentID);
            }
            //console.log(this.urlRoot);
			this.set("ordering", data.ordering || 1);
		}
	});
	return Association;
});
