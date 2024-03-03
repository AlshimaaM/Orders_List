sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel", "sap/m/MessageToast"
], function(Controller, ODataModel) {
	"use strict";

	return Controller.extend("task_orders.controller.Overview", {
		onInit: function() {
			 //https://cors-anywhere.herokuapp.com/
 var sServiceUrl = "https://cors-anywhere.herokuapp.com/https://services.odata.org/V2/Northwind/Northwind.svc/";
    var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);
    this.getView().setModel(oModel);
 
		 },
		onPress: function(oEvent) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oItemData = oEvent.getSource().getBindingContext().getObject();
			// Serialize the object to JSON string before passing it as data
			var sData = JSON.stringify(oItemData);

			// oRouter.navTo("items", {
			// 	data: encodeURIComponent(sData) // Encode the data to avoid special character issues
			// });
			
			// Retrieve the OrderID from the binding context
    var oItemData2 = oEvent.getSource().getBindingContext().getProperty("OrderID");
    // var sOrderID = oItemData2.OrderID;

    // Navigate to the items page with the OrderID as a parameter
    oRouter.navTo("items", {
        data: oItemData2
    });

		}
	});
});