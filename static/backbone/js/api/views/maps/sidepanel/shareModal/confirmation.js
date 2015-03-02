/**
 * Created by zmmachar on 2/25/15.
 */
define(["jquery",
        "underscore",
            "text!" + templateDir + "/modals/confirmationModal.html",
        "collections/snapshots",
        "views/maps/sidepanel/shareModal/snapshotItem",
        "models/snapshot",
        "lib/maps/geometry/geometry"
    ],
    function ($, _, confirmationModal) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * confirmation modal
         * @class DataPanel
         */

        var Confirmation = {
            id: 'confirmation-wrapper',

            /**
             * opts: an object expecting a message property with the following form:
             * {
             *  message: message to confirm
             *  callback: function to call given confirmation
             *  }
             *
             */
            confirm: function (opts) {
                var $el = $(_.template(confirmationModal, {content: opts.message}));
                $el.modal();
                $el.find('#confirm').click(opts.callback);
                $el.on('hidden.bs.modal', function () {
                    $el.remove();
                });
            }
        };

        return Confirmation;
    });