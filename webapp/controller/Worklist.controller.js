sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    //	"mycompany/myapp/MyWorklistApp/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (BaseController, JSONModel, ODataModel, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("zfsaccountcreation.controller.Worklist", {
      //formatter: formatter,

      /* =========================================================== */
      /* lifecycle methods                                           */
      /* =========================================================== */

      /**
       * Called when the worklist controller is instantiated.
       * @public
       */
      onInit: function () {
        var oViewModel,
          iOriginalBusyDelay,
          oTable = this.byId("table");

        this.StepModel = new JSONModel({
          SubmitVisible: false,
        });
        this.getView().setModel(this.StepModel, "StepModel");

        // Put down worklist table's original value for busy indicator delay,
        // so it can be restored later on. Busy handling on the table is
        // taken care of by the table itself.
        iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
        this._oTable = oTable;
        var oModel = new ODataModel(
          "/sap/opu/odata/sap/ZFS_ACCOUNT_CREATION_SRV/"
        );
        // this.getView().setModel(oModel);
        var sPath = "/ButtonListSet";
        oModel.read(sPath, {
          success: (oData) => {
            this.StepModel.setProperty(
              "/SubmitVisible",
              oData.results[0].Create
            );
          },
          error: (e) => {
            this.showErrorMessage(this.parseError(e));
          },
        });

        // keeps the search state
        this._aTableSearchState = [];

        // Model used to manipulate control states
        oViewModel = new JSONModel({
        	worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
        	shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
        	shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
        	shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
        	tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
        	tableBusyDelay: 0,
        	inStock: 0,
        	shortage: 0,
        	outOfStock: 0,
        	countAll: 0
        });
        this.setModel(oViewModel, "worklistView");
        // Create an object of filters

        // Make sure, busy indication is showing immediately so there is no
        // break after the busy indication for loading the view's meta data is
        // ended (see promise 'oWhenMetadataIsLoaded' in AppController)
        oTable.attachEventOnce("updateFinished", function () {
          // Restore original busy indicator delay for worklist's table
          oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
        });
      },

      /* =========================================================== */
      /* event handlers                                              */
      /* =========================================================== */

      /**
       * Triggered by the table's 'updateFinished' event: after new table
       * data is available, this handler method updates the table counter.
       * This should only happen if the update was successful, which is
       * why this handler is attached to 'updateFinished' and not to the
       * table's list binding's 'dataReceived' method.
       * @param {sap.ui.base.Event} oEvent the update finished event
       * @public
       */
      handleNewButtonPress: function () {
        // Get the router instance
        this.getRouter().navTo("RouteMainWizard", {
          SAction: "New",
        });
        //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

        // Navigate to the "MainWizard" route
        //oRouter.navTo("RouteMainWizard");
      },
      // formatDate: function (sTimestamp) {
      //   if (!sTimestamp) {
      //     return "";
      //   }

      //   var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
      //     pattern: "dd-MM-yyyy HH:mm:ss",
      //   });

      //   var oDate = oDateFormat.parse(sTimestamp);
      //   return oDateFormat.format(oDate);
      // },

  //     formatDate: function (timestamp) {
  //     var year = timestamp.substr(0, 4);
  //     var month = timestamp.substr(4, 2);
  //     var day = timestamp.substr(6, 2);
  //     var hour = timestamp.substr(8, 2);
  //     var minute = timestamp.substr(10, 2);
  //     var second = timestamp.substr(12, 2);
  
  //     var cetDate = new Date(year, month - 1, day, hour, minute, second);
      
  //     var options = {
  //         year: "numeric",
  //         month: "2-digit",
  //         day: "2-digit",
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         second: "2-digit",
  //         hour12: false,
  //         timeZone: "Europe/Berlin", // Set to CET time zone
  //     };
  
  //     var sDate = cetDate.toLocaleString("en-US", options);
  //     return sDate.replace(',', '');
      
  // },

      
      /**
       * Event handler when a table item gets pressed
       * @param {sap.ui.base.Event} oEvent the table selectionChange event
       * @public
       */
      onPress: function (oEvent) {
        // The source is the list item that got pressed
        this._showObject(oEvent.getSource());
      },

      /**
       * Event handler for navigating back.
       * We navigate back in the browser history
       * @public
       */
      onNavBack: function () {
        history.go(-1);
      },

      onSearch: function (oEvent) {
        if (oEvent.getParameters().refreshButtonPressed) {
          // Search field's 'refresh' button has been pressed.
          // This is visible if you select any master list item.
          // In this case no new search is triggered, we only
          // refresh the list binding.
          this.onRefresh();
        } else {
          var aTableSearchState = [];
          var sQuery = oEvent.getParameter("query");

          if (sQuery && sQuery.length > 0) {
            aTableSearchState = [
              new Filter("Step4", FilterOperator.Contains, sQuery),
            ];
          }
          this._applySearch(aTableSearchState);
        }
      },


      onStatusChange: function (oEvent) {
        var sSelectedStatus = oEvent.getParameter("selectedItem").getKey();
        this.getView().getModel("worklistView").setProperty("/selectedStatus", sSelectedStatus);

        // Call a function to update the table based on the selected status
        this.updateTableData();
    },

    updateTableData: function () {
        var oTable = this.getView().byId("table");
        var sSelectedStatus = this.getView().getModel("worklistView").getProperty("/selectedStatus");

        // Create a filter for the selected status
        var aFilters = [];
        if (sSelectedStatus !== "All") {
            aFilters.push(new Filter("Step4", FilterOperator.Contains, sSelectedStatus));
        }

        // Apply the filters to the binding of the table
        oTable.getBinding("items").filter(aFilters);
    },


      /**
       * Event handler for refresh event. Keeps filter, sort
       * and group settings and refreshes the list binding.
       * @public
       */
      onRefresh: function () {
        var oTable = this.byId("table");
        oTable.getBinding("items").refresh();
      },

      /* =========================================================== */
      /* internal methods                                            */
      /* =========================================================== */

      /**
       * Shows the selected item on the object page
       * On phones a additional history entry is created
       * @param {sap.m.ObjectListItem} oItem selected Item
       * @private
       */
      _showObject: function (oItem) {
        this.getRouter().navTo("object", {
          objectId: oItem.getBindingContext().getProperty("Level06"),
          status: oItem.getBindingContext().getProperty("Guid"),
        });
      },

      /**
       * Internal helper method to apply both filter and search state together on the list binding
       * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
       * @private
       */
      _applySearch: function (aTableSearchState) {
        var oTable = this.byId("table"),
          oViewModel = this.getModel("worklistView");
        oTable.getBinding("items").filter(aTableSearchState, "Application");
        // changes the noDataText of the list in case there are no filter results
        if (aTableSearchState.length !== 0) {
          oViewModel.setProperty(
            "/tableNoDataText",
            this.getResourceBundle().getText("Nessun dato trovato")
          );
        }
      },

      /**
       * Event handler when a filter tab gets pressed
       * @param {sap.ui.base.Event} oEvent the filter tab event
       * @public
       */
      onQuickFilter: function (oEvent) {
        var oBinding = this._oTable.getBinding("items"),
          sKey = oEvent.getParameter("selectedKey");
        oBinding.filter(this._mFilters[sKey]);
      },
    });
  }
);
