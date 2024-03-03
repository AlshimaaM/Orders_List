sap.ui.define([
    "sap/ui/base/ManagedObject"
], function (ManagedObject) {
"use strict";
return ManagedObject.extend("task_orders.controller.ProductDetailsController", {
    constructor: function(oView){
        this._oView = oView;
        console.log("View constructor:", oView);
    },
    exit:function(){
        delete this._oView;
    },
    open : function (productId) {
        var oView = this._oView;
        var oDialog = oView.byId("detailsFragment");
        var oController = oView.getController();
          console.log("View object:", productId);
         
        if(!oDialog){
            var oFragmentController = {
                beforeOpen:function(oEvent){
                },  onClose:function(){
        	oDialog.close();
        }
            };
     
            oDialog = sap.ui.xmlfragment(oView.getId(), "task_orders.fragment.ProductDetails", oFragmentController);
            oView.addDependent(oDialog);
        } 
                	var productDetails = [];
                		var sServiceUrl = "https://cors-anywhere.herokuapp.com/https://services.odata.org/V2/Northwind/Northwind.svc/";
                		var sUrl = sServiceUrl + "/Products('" + productId + "')";
			var oModelP = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);
			oModelP.read("/Products", {
				filters: [new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.EQ, productId)],
				success: function(productModel) {
						// debugger;
						productModel.results.forEach(function(productDetail) {

							productDetails.push({
								ProductID: productDetail.ProductID,
								ProductName: productDetail.ProductName,
								UnitPrice: productDetail.UnitPrice,
								CategoryID: productDetail.CategoryID,
								QuantityPerUnit: productDetail.QuantityPerUnit,
								SupplierID: productDetail.SupplierID,
								UnitsInStock: productDetail.UnitsInStock,
								UnitsOnOrder: productDetail.UnitsOnOrder
							});
						});
					  var oFragmentModel =oView.getModel("idModel");
		     	    if (oFragmentModel) {
					    oFragmentModel.setProperty("/productDetails", productDetails);
					} else {
					    console.error("Fragment model is undefined.");
					}

					}
					.bind(this),
				error: function() {
					console.error("Error fetching product details for order " + productId);
				}
			});
        // open dialog
            oDialog.open();
        }
    });
});
