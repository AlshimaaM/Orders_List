sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"task_orders/controller/ProductDetailsController",
	"sap/ui/core/routing/History"
	// ], function(Controller,ODataModel, JSONModel, Fragment,FragmentController, History) {
], function(Controller, ODataModel, JSONModel, Fragment,ProductDetailsController, History) {
	"use strict";

	var sServiceUrl = "https://cors-anywhere.herokuapp.com/https://services.odata.org/V2/Northwind/Northwind.svc/";
	return Controller.extend("task_orders.controller.OrderItems", {
		onInit: function() {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("items").attachMatched(this._onRouteMatched, this);
		
		},

		_onRouteMatched: function(oEvent) {
			var sData = decodeURIComponent(oEvent.getParameter("arguments").data);
			var oData = JSON.parse(sData);
			// Set the order data to the view model
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				data: oData
			});
			this.getView().setModel(oModel, "idModel");

			// Retrieve the OrderID from the data parameter
			var orderId = oData;

			// Read order details based on the order ID
			var oModel1 = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);
			oModel1.read("/Order_Details_Extendeds", {
				filters: [
					new sap.ui.model.Filter("OrderID", sap.ui.model.FilterOperator.EQ, orderId)
				],

				success: function(oData3) {
					var products = [];
					oData3.results.forEach(function(orderDetail) {
						products.push({
							OrderID: orderDetail.OrderID,
							ProductID: orderDetail.ProductID,
							ProductName: orderDetail.ProductName,
							UnitPrice: orderDetail.UnitPrice,
							Quantity: orderDetail.Quantity,
							Discount: orderDetail.Discount
						});
					});
					var oViewModel = this.getView().getModel("idModel");
					oViewModel.setProperty("/products", products);

				}.bind(this),
				error: function() {
					console.error("Error fetching order details for order " + orderId);
				}
			});

		},
		onPress: function(oEvent) {
			    // this.ProductDetailsController = new ProductDetailsController(this);
			// var oView = this.getView(); // Get reference to the view
// var oManagedObject = new ManagedObject(oView);

		  var oSelectedItem = oEvent.getSource().getBindingContext("idModel").getObject();
				 var productId = oSelectedItem.ProductID;
				 	var oViewModelId = this.getView().getModel("idModel");
					oViewModelId.setProperty("/ProductID", productId);
					var oView = this.getView();
						var oProductDetailsController = new ProductDetailsController(oView);
						oProductDetailsController.open(productId);
				// this.getOwnerComponent().ProductDetailsController.open(productId);
					// this.ProductDetailsController.open(productId);
			// this._openFragmentWithDetails(oSelectedItem);
		},
		_openFragmentWithDetails: function(oData) {
			var productId = oData.ProductID;
			var oView = this.getView();
			// var oFragmentModel = new JSONModel(oData); // Set the selected product data directly to the fragment model
			// oView.setModel(oFragmentModel, "selectedProductModel");
			// var oFragmentModel = new JSONModel();
			// oFragmentModel.setData(oData);
			// // Set the ProductID in a model
			// var oProductIdModel = new JSONModel();
			// oProductIdModel.setData({
			// 	ProductID: productId
			// });
			// oView.setModel(oProductIdModel, "productIdModel");
		
			var controll = "task_orders.controller.ProductDetailsController";
			var productDetails = [];
			// var oModelP = new sap.ui.model.odata.v2.ODataModel(sServiceUrl );
			var sUrl = sServiceUrl + "/Products('" + productId + "')";
			var oModelP = new sap.ui.model.odata.v2.ODataModel(sServiceUrl);
			oModelP.read("/Products", {
				filters: [new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.EQ, productId)],
				success: function(productModel) {
						// console.log(JSON.stringify(productModel));

						console.log("Products for product " + productModel.results[0].CategoryID);
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
					  var oFragmentModel = this.getView().getModel("idModel");
					  
		     	    oFragmentModel.setProperty("/productDetails", productDetails);

					}
					.bind(this),
				error: function() {
					console.error("Error fetching product details for order " + productId);
				}
			});
		
			if (!this._oFragment) {
				this._oFragment = Fragment.load({
					id: oView.getId(),
					name: "task_orders.fragment.ProductDetails",
					controller: this
					 //models: {
      //      fragmentModel: oFragmentModel // Assuming oFragmentModel is your fragment model
      //  }
				}).then(function(oFragment) {
			this._oFragment = oFragment;
					oView.addDependent(this._oFragment);
					this._oFragment.open();

				}.bind(this));
			} else {
				this._oFragment.open();
			}
			// },
			
			
		 //var oFragmentController = new FragmentController();
   //      var oFragment = sap.ui.xmlfragment("task_orders.fragment.ProductDetails", oFragmentController);
   //      this.getView().byId("myPage").addContent(oFragment);

		},

		onClose: function() {
			if (this._oFragment) {
				this._oFragment.close();
			}
		},

		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("overview", {}, true);
			}
		}
	});
});