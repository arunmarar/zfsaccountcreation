sap.ui.define([
	// 'sap/ui/core/mvc/Controller',
	"./BaseController",
    "sap/ui/model/json/JSONModel",
   // "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/core/library",
    "../model/servicemodel",
	"sap/m/Text",
	"sap/m/TextArea",
    "sap/m/Dialog",
	"sap/m/Button",
    "sap/m/library",
    "sap/m/Label",
    "sap/ui/core/Core"
], function (BaseController, JSONModel, Filter, FilterOperator,MessageToast, MessageBox, Fragment, 
    CoreLibrary,
    Servicemodel,Text,TextArea,Dialog,Button,mobileLibrary,Label,Core) {
	"use strict";

	var history = {
		prevPaymentSelect: null,
		prevDiffDeliverySelect: null
	};

	return BaseController.extend("zfsaccountcreation.controller.MainWizard", {
		onInit: function () {
			this.serviceModel = new Servicemodel(this);
            const ComboModel = this.serviceModel.getComboModel();
			var a = 1;

			this.StepModel = new JSONModel({
				Step2items: {},
				Step3items: {},
				Step4items: {},
				Step2Visibility: true,
				Step3Visibility: true,
				Step4Visibility: true,
				SelectedStep1: '',
				SelectedStep2: '',
				SelectedStep3: '',
				SelectedStep4: '',
				Level1items:{},
				Level2items:{},
				Level3items:{},
				Level4items:{},
				Level5items:{},
				Level6items:{},
				Level1Visibility: true,
				Level2Visibility: true,
				Level3Visibility: true,
				Level4Visibility: true,
				Level5Visibility: true,
				SelectedLevel1: '',
				SelectedLevel1V: '',
				SelectedLevel2: '',
				SelectedLevel2V: '',
				SelectedLevel3: '',
				SelectedLevel3V: '',
				SelectedLevel4: '',
				SelectedLevel4V: '',
				SelectedLevel5: '',
				SelectedLevel5V: '',
				SelectedLevel6: '',
				Level1Note: '',
				Level2Note: '',
				Level3Note: '',
				Level4Note: '',
				Level5Note: '',
								})
			this.getView().setModel(this.StepModel, 'StepModel'); 
	
			 this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
		},
		onNavBack : function() {
			
				this.getRouter().navTo("RouteMainWorklist");
			
		},
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			// this.getModel().metadataLoaded().then( function() {
			// 	var sObjectPath = this.getModel().createKey("Products", {
			// 		ProductID :  sObjectId
			// 	});
			// 	this._bindView("/" + sObjectPath);
			// }.bind(this));
			var sfilter1 = new Filter({
				path: "Step1",
				operator: 'EQ',
				value1: sObjectId 

			})
			var sPath = '/Step2Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1],
				success: oData => {
					
					this.StepModel.setProperty('/Step2items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Step2Visibility', false);
						this.onChangeStep2();
				    }
					else{
						this.StepModel.setProperty('/Step2Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});
		},
		onChangeStep1: function (oEvent) {
			this.StepModel.setProperty('/Step2items', {});
			this.StepModel.setProperty('/Step3items', {});
			this.StepModel.setProperty('/Step4items', {});
			this.StepModel.setProperty('/Step2Visibility', true);
			this.StepModel.setProperty('/Step3Visibility', true);
			this.StepModel.setProperty('/Step4Visibility', true);
			
			this.StepModel.setProperty('/SelectedStep2', '');
			this.StepModel.setProperty('/SelectedStep3', '');
			this.StepModel.setProperty('/SelectedStep4', '');
			var selectedKey = this.StepModel.getProperty('/SelectedStep1');
			//var selectedKey = oEvent.getSource().getSelectedKey();
			var sfilter1 = new Filter({
				path: "Step1",
				operator: 'EQ',
				value1: selectedKey

			})
			var sfilter2 = new Filter({
				path: "Step2",
				operator: 'NE',
				value1: ''

			})
			var sPath = '/Step2Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1,sfilter2],
				success: oData => {
					
					this.StepModel.setProperty('/Step2items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Step2Visibility', false);
						this.onChangeStep2();
				    }
					else{
						this.StepModel.setProperty('/Step2Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});

		},
	
		onChangeStep2: function (oEvent) {
	
			this.StepModel.setProperty('/Step3items', {});
			this.StepModel.setProperty('/Step4items', {});
			
			this.StepModel.setProperty('/Step3Visibility', true);
			this.StepModel.setProperty('/Step4Visibility', true);
			
			
			this.StepModel.setProperty('/SelectedStep3', '');
			this.StepModel.setProperty('/SelectedStep4', '');
			var selectedKey = this.StepModel.getProperty('/SelectedStep2');
			//var selectedKey = oEvent.getSource().getSelectedKey();
			var sfilter1 = new Filter({
				path: "Step2",
				operator: 'EQ',
				value1: selectedKey

			});
			var sfilter2 = new Filter({
				path: "Step3",
				operator: 'NE',
				value1: ''

			});
			var selectedStep1 = this.StepModel.getProperty('/SelectedStep1');
			var sfilter3 = new Filter({
				path: "Step1",
				operator: 'EQ',
				value1: selectedStep1

			});
			var sPath = '/Step3Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1,sfilter2,sfilter3],
				success: oData => {
					//this.getView().getModel().setProperty('/TipoRic', oData.results);
					this.StepModel.setProperty('/Step3items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Step3Visibility', false);
						this.onChangeStep3();
				    }
					else{
						this.StepModel.setProperty('/Step3Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});

		},
	
		onChangeStep3: function (oEvent) {
	
		
			this.StepModel.setProperty('/Step4items', {});
			
			
			this.StepModel.setProperty('/Step4Visibility', true);
			
			
			
			this.StepModel.setProperty('/SelectedStep4', '');
			var selectedKey = this.StepModel.getProperty('/SelectedStep3');
			//var selectedKey = oEvent.getSource().getSelectedKey();
			var sfilter1 = new Filter({
				path: "Step3",
				operator: 'EQ',
				value1: selectedKey

			});
			var sfilter2 = new Filter({
				path: "Step4",
				operator: 'NE',
				value1: ''

			});
			var selectedStep2 = this.StepModel.getProperty('/SelectedStep2');
			var sfilter3 = new Filter({
				path: "Step2",
				operator: 'EQ',
				value1: selectedStep2

			});
			var selectedStep1 = this.StepModel.getProperty('/SelectedStep1');
			var sfilter4 = new Filter({
				path: "Step1",
				operator: 'EQ',
				value1: selectedStep1

			});
			var sPath = '/Step4Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1,sfilter2,sfilter3,sfilter4],
				success: oData => {
					//this.getView().getModel().setProperty('/TipoRic', oData.results);
					this.StepModel.setProperty('/Step4items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Step4Visibility', false);
						this.onChangeStep4();
				    }
					else{
						this.StepModel.setProperty('/Step4Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});

		},
	

		onChangeStep4: function (oEvent) {
			this.StepModel.setProperty('/Level1items', {});
			this.StepModel.setProperty('/Level2items', {});
			this.StepModel.setProperty('/Level3items', {});
			this.StepModel.setProperty('/Level4items', {});
			this.StepModel.setProperty('/Level5items', {});
			this.StepModel.setProperty('/Level1Visibility', true);
			this.StepModel.setProperty('/Level2Visibility', true);
			this.StepModel.setProperty('/Level3Visibility', true);
			this.StepModel.setProperty('/Level4Visibility', true);
			this.StepModel.setProperty('/Level5Visibility', true);
			this.StepModel.setProperty('/SelectedLevel1', '');
			this.StepModel.setProperty('/SelectedLevel2', '');
			this.StepModel.setProperty('/SelectedLevel3', '');
			this.StepModel.setProperty('/SelectedLevel4', '');
			this.StepModel.setProperty('/SelectedLevel5', '');
			//var selectedKey = this.StepModel.getProperty('/SelectedStep4');
			//var selectedKey = oEvent.getSource().getSelectedKey();
			var sfilter1 = new Filter({
				path: "Step1",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedStep1')

			})
			var sfilter2 = new Filter({
				path: "Step2",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedStep2')

			})
			var sfilter3 = new Filter({
				path: "Step3",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedStep3')

			})
			var sfilter4 = new Filter({
				path: "Step4",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedStep4')

			})
			var sfilter5 = new Filter({
				path: "Level01",
				operator: 'NE',
				value1: ''

			})
			var sPath = '/Level1Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1,sfilter2,sfilter3,sfilter4],
				success: oData => {
					
					this.StepModel.setProperty('/Level1items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Level1Visibility', false);
						// this.onChangeStep2();
				    }
					else{
						this.StepModel.setProperty('/Level1Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});
	
		},


		onChangeLevel1: function (oEvent) {
			this.StepModel.setProperty('/Level2items', {});
			this.StepModel.setProperty('/Level3items', {});
			this.StepModel.setProperty('/Level4items', {});
			this.StepModel.setProperty('/Level5items', {});
			this.StepModel.setProperty('/Level2Visibility', true);
			this.StepModel.setProperty('/Level3Visibility', true);
			this.StepModel.setProperty('/Level4Visibility', true);
			this.StepModel.setProperty('/Level5Visibility', true);
			this.StepModel.setProperty('/SelectedLevel2', '');
			this.StepModel.setProperty('/SelectedLevel3', '');
			this.StepModel.setProperty('/SelectedLevel4', '');
			this.StepModel.setProperty('/SelectedLevel5', '');
			
			
			var sfilter1 = new Filter({
				path: "Level01",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedLevel1')

			})
			var sfilter2 = new Filter({
				path: "Level02",
				operator: 'NE',
				value1: ''

			})
			var sPath = '/Level2Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1,sfilter2],
				success: oData => {
					
					this.StepModel.setProperty('/Level2items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Level2Visibility', false);
						// this.onChangeStep2();
				    }
					else{
						this.StepModel.setProperty('/Level2Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});

	var result= this.StepModel.getProperty('/Level1items').find(
		item => item.Level01 === this.StepModel.getProperty('/SelectedLevel1')
		);
	this.StepModel.setProperty('/Level1Note', result.Note);
	this.StepModel.setProperty('/SelectedLevel1V', result.Descrption)
		},
	
	
	
		onChangeLevel2: function (oEvent) {
			
			this.StepModel.setProperty('/Level3items', {});
			this.StepModel.setProperty('/Level4items', {});
			this.StepModel.setProperty('/Level5items', {});
			this.StepModel.setProperty('/Level3Visibility', true);
			this.StepModel.setProperty('/Level4Visibility', true);
			this.StepModel.setProperty('/Level5Visibility', true);
			this.StepModel.setProperty('/SelectedLevel3', '');
			this.StepModel.setProperty('/SelectedLevel4', '');
			this.StepModel.setProperty('/SelectedLevel5', '');

			
			var sfilter1 = new Filter({
				path: "Level02",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedLevel2')

			})
			var sfilter2 = new Filter({
				path: "Level03",
				operator: 'NE',
				value1: ''

			})
			var sPath = '/Level3Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1,sfilter2],
				success: oData => {
					
					this.StepModel.setProperty('/Level3items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Level3Visibility', false);
						// this.onChangeStep2();
				    }
					else{
						this.StepModel.setProperty('/Level3Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});
			var result = this.StepModel.getProperty('/Level2items').find(
				item => item.Level02 === this.StepModel.getProperty('/SelectedLevel2')
				);
			
			this.StepModel.setProperty('/Level2Note', result.Note);
	this.StepModel.setProperty('/SelectedLevel2V', result.Descrption)
		},
		

		onChangeLevel3: function (oEvent) {
			
			
			this.StepModel.setProperty('/Level4items', {});
			this.StepModel.setProperty('/Level5items', {});
			
			this.StepModel.setProperty('/Level4Visibility', true);
			this.StepModel.setProperty('/Level5Visibility', true);
			
			this.StepModel.setProperty('/SelectedLevel4', '');
			this.StepModel.setProperty('/SelectedLevel5', '');
			
			var sfilter1 = new Filter({
				path: "Level03",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedLevel3')

			})
			var sfilter2 = new Filter({
				path: "Level04",
				operator: 'NE',
				value1: ''

			})
			var sPath = '/Level4Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1,sfilter2],
				success: oData => {
					
					this.StepModel.setProperty('/Level4items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Level4Visibility', false);
						// this.onChangeStep2();
				    }
					else{
						this.StepModel.setProperty('/Level4Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});
			var result = this.StepModel.getProperty('/Level3items').find(
				item => item.Level03 === this.StepModel.getProperty('/SelectedLevel3')
				);
				this.StepModel.setProperty('/Level3Note', result.Note);
				this.StepModel.setProperty('/SelectedLevel3V', result.Descrption)
		},


		onChangeLevel4: function (oEvent) {
			
			
			this.StepModel.setProperty('/Level5items', {});
			
			this.StepModel.setProperty('/Level5Visibility', true);
			
			
			this.StepModel.setProperty('/SelectedLevel5', '');

			
			var sfilter1 = new Filter({
				path: "Level04",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedLevel4')

			})
			var sfilter2 = new Filter({
				path: "Level05",
				operator: 'NE',
				value1: ''

			})
			var sPath = '/Level5Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1,sfilter2],
				success: oData => {
					
					this.StepModel.setProperty('/Level5items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Level5Visibility', false);
						// this.onChangeStep2();
				    }
					else{
						this.StepModel.setProperty('/Level5Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});
			var result = this.StepModel.getProperty('/Level4items').find(
				item => item.Level04 === this.StepModel.getProperty('/SelectedLevel4')
				);
				this.StepModel.setProperty('/Level4Note', result.Note);
				this.StepModel.setProperty('/SelectedLevel4V', result.Descrption)
		},

		
		onChangeLevel5: function (oEvent) {
			
			var result = this.StepModel.getProperty('/Level5items').find(
				item => item.Level05 === this.StepModel.getProperty('/SelectedLevel5'));
				this.StepModel.setProperty('/SelectedLev5l1V', result.Descrption
				);
			var sfilter1 = new Filter({
				path: "Level06",
				operator: 'EQ',
				value1: this.StepModel.getProperty('/SelectedLevel5')

			})
			
			var sPath = '/Level6Set' ; 
			this.getView().getModel().read(sPath, {
				filters:[sfilter1],
				success: oData => {
					this.StepModel.setProperty('/SelectedLevel6', oData.results[0].Level06);
					this.StepModel.setProperty('/Level6items', oData.results);
					if ( oData.results.length === 0)
					{
						this.StepModel.setProperty('/Level6Visibility', false);
						// this.onChangeStep2();
				    }
					else{
						this.StepModel.setProperty('/Level6Visibility', true);
					}										
				},
				error: e => {  
					this.showErrorMessage(this.parseError(e));
				   
				}
			});

			var result = this.StepModel.getProperty('/Level5items').find(
				item => item.Level05 === this.StepModel.getProperty('/SelectedLevel5')
				);
				this.StepModel.setProperty('/Level5Note', result.Note);
				this.StepModel.setProperty('/SelectedLevel5V', result.DESCRPTION)
			
		},

		goToPaymentStep: function () {
			var selectedKey = this.model.getProperty("/selectedPayment");

			switch (selectedKey) {
				case "Credit Card":
					this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CreditCardStep"));
					break;
				case "Bank Transfer":
					this.byId("PaymentTypeStep").setNextStep(this.getView().byId("BankAccountStep"));
					break;
				case "Cash on Delivery":
				default:
					this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CashOnDeliveryStep"));
					break;
			}
		},

		setPaymentMethod: function () {
			this.setDiscardableProperty({
				message: "Are you sure you want to change the payment type ? This will discard your progress.",
				discardStep: this.byId("PaymentTypeStep"),
				modelPath: "/selectedPayment",
				historyPath: "prevPaymentSelect"
			});
		},

		setDifferentDeliveryAddress: function () {
			this.setDiscardableProperty({
				message: "Are you sure you want to change the delivery address ? This will discard your progress",
				discardStep: this.byId("BillingStep"),
				modelPath: "/differentDeliveryAddress",
				historyPath: "prevDiffDeliverySelect"
			});
		},

		setDiscardableProperty: function (params) {
			if (this._wizard.getProgressStep() !== params.discardStep) {
				MessageBox.warning(params.message, {
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {
							this._wizard.discardProgress(params.discardStep);
							history[params.historyPath] = this.model.getProperty(params.modelPath);
						} else {
							this.model.setProperty(params.modelPath, history[params.historyPath]);
						}
					}.bind(this)
				});
			} else {
				history[params.historyPath] = this.model.getProperty(params.modelPath);
			}
		},

		billingAddressComplete: function () {
			if (this.model.getProperty("/differentDeliveryAddress")) {
				this.byId("BillingStep").setNextStep(this.getView().byId("DeliveryAddressStep"));
			} else {
				this.byId("BillingStep").setNextStep(this.getView().byId("DeliveryTypeStep"));
			}
		},

		handleWizardCancel: function () {
			// this._handleMessageBoxOpen("Are you sure you want to cancel ?", "warning");
			//history.go(-1);
			 this.onNavBack();
		},

		handleWizardSubmit: function () {
			this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
		},

		backToWizardContent: function () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		},

		checkCreditCardStep: function () {
			var cardName = this.model.getProperty("/CreditCard/Name") || "";
			if (cardName.length < 3) {
				this._wizard.invalidateStep(this.byId("CreditCardStep"));
			} else {
				this._wizard.validateStep(this.byId("CreditCardStep"));
			}
		},

		checkCashOnDeliveryStep: function () {
			var firstName = this.model.getProperty("/CashOnDelivery/FirstName") || "";
			if (firstName.length < 3) {
				this._wizard.invalidateStep(this.byId("CashOnDeliveryStep"));
			} else {
				this._wizard.validateStep(this.byId("CashOnDeliveryStep"));
			}
		},

		checkBillingStep: function () {
			var address = this.model.getProperty("/BillingAddress/Address") || "";
			var city = this.model.getProperty("/BillingAddress/City") || "";
			var zipCode = this.model.getProperty("/BillingAddress/ZipCode") || "";
			var country = this.model.getProperty("/BillingAddress/Country") || "";

			if (address.length < 3 || city.length < 3 || zipCode.length < 3 || country.length < 3) {
				this._wizard.invalidateStep(this.byId("BillingStep"));
			} else {
				this._wizard.validateStep(this.byId("BillingStep"));
			}
		},

		completedHandler: function () {
			this._oNavContainer.to(this.byId("wizardBranchingReviewPage"));
		},

		_handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
			MessageBox[sMessageBoxType](sMessage, {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {
						this._wizard.discardProgress(this._wizard.getSteps()[0]);
						this._navBackToList();
					}
				}.bind(this)
			});
		},

		_navBackToList: function () {
			this._navBackToStep(this.byId("ContentsStep"));
		},

		_navBackToPaymentType: function () {
			this._navBackToStep(this.byId("PaymentTypeStep"));
		},

		_navBackToCreditCard: function () {
			this._navBackToStep(this.byId("CreditCardStep"));
		},

		_navBackToCashOnDelivery: function () {
			this._navBackToStep(this.byId("CashOnDeliveryStep"));
		},

		_navBackToBillingAddress: function () {
			this._navBackToStep(this.byId("BillingStep"));
		},

		_navBackToDeliveryType: function () {
			this._navBackToStep(this.byId("DeliveryTypeStep"));
		},

		_navBackToStep: function (step) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(step);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this._oNavContainer.to(this._oWizardContentPage);
		}
	});
});