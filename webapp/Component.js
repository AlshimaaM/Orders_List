sap.ui.define([
	"sap/ui/core/UIComponent"
	// "task_orders/controller/ProductDetailsController"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("task_orders.Component", {

		metadata : {
			manifest: "json"
		},

		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
           //this.ProductDetailsController = new ProductDetailsController(this.getRootControl());
            // this.ProductDetailsController = new ProductDetailsController(this);
			// additional initialization can be done here
		
			this.getRouter().initialize();
		}

	});
});