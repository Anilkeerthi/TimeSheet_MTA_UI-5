sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"

], (Controller, Fragment, MessageToast) => {
    "use strict";

    return Controller.extend("com.manager.manager.controller.Manager", {
        onInit() {

        },
        onSectionChanged: function (oEvent) {
            var sSelectedSectionId = oEvent.getParameter("section").getId();

            // Get the "Add New Project" button
            var oAddNewProjectButton = this.byId("addNewProjectButton");

            // Check if the selected section is the "Projects" section
            if (sSelectedSectionId.endsWith("idOPSRequestCategory")) {
                oAddNewProjectButton.setVisible(true); // Show the button for Projects
            } else {
                oAddNewProjectButton.setVisible(false); // Hide the button for other sections
            }
        },
        formatEmployeeNames: function (aEmployees) {
            if (Array.isArray(aEmployees)) {
                return aEmployees
                    .map(ep => ep.employee?.fullName) // Get the associated employee's fullName
                    .filter(name => !!name)          // Remove undefined/null
                    .join(", ");
            }
            return "";
        },
        // onAddNewPress: function () {
        //     let oView = this.getView();
        //     if (!this.pNewProjectDialog) {
        //         this.pNewProjectDialog = Fragment.load({
        //             id: oView.getId(),
        //             name: "com.manager.manager.view.AddNewProject",
        //             controller: this
        //         }).then(function (oDialog) {
        //             oView.addDependent(oDialog);
        //             return oDialog;
        //         });
        //     }
        //     this.pNewProjectDialog.then(function (oDialog) {
        //         oDialog.open();
        //     });
        // },
        onAddNewPress: function () {
            let oView = this.getView();
            if (!this.pNewProjectDialog) {
                this.pNewProjectDialog = Fragment.load({
                    id: oView.getId(),
                    name: "com.manager.manager.view.AddNewProject",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                }).catch(function (err) {
                    console.error("Error loading AddNewProject fragment:", err);
                    MessageToast.show("Failed to open project creation dialog.");
                });
            }

            this.pNewProjectDialog.then(function (oDialog) {
                oDialog.open();
            }).catch(function (err) {
                console.error("Error opening project dialog:", err);
                MessageToast.show("Could not open the project dialog.");
            });
        },

        // onNewProjectClose: function () {
        //     if (this.pNewProjectDialog) {
        //         this.pNewProjectDialog.then(function (oDialog) {
        //             if (oDialog) {
        //                 oDialog.close();
        //             }
        //         });
        //     }
        // },
        onNewProjectClose: function () {
            if (this.pNewProjectDialog) {
                this.pNewProjectDialog.then(function (oDialog) {
                    if (oDialog) {
                        oDialog.close();
                    }
                }).catch(function (err) {
                    console.error("Error closing project dialog:", err);
                    MessageToast.show("Failed to close the project dialog.");
                });
            }
        },

        onNewProSubmit: function () {
            var oView = this.getView();
            var oModel = oView.getModel(); // OData V4 model
            var that = this;

            var sProjectName = oView.byId("inputProjectName").getValue();
            var oStartDate = oView.byId("startDate").getDateValue();
            var oEndDate = oView.byId("endDate").getDateValue();
            var aEmployeeIDs = oView.byId("EmployeeCombo").getSelectedKeys();

            if (!sProjectName || !oStartDate || !oEndDate || aEmployeeIDs.length === 0) {
                sap.m.MessageToast.show("Please fill in all fields.");
                return;
            }

            function formatDate(date) {
                return date.toISOString().split("T")[0];
            }

            $.ajax({
                url: "/odata/v4/timesheet/createProjectWithEmployees",
                method: "POST",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({
                    input: {
                        projectName: sProjectName,
                        startDate: formatDate(oStartDate),
                        endDate: formatDate(oEndDate),
                        employeeIDs: aEmployeeIDs
                    }
                }),


                success: function (response) {
                    sap.m.MessageToast.show("Project created successfully!");
                    console.log("Backend response:", response);

                    that.onNewProjectClose();
                    that.onNewProClear();
                    that.refreshTable();

                },

                error: function (xhr, status, error) {
                    var errorMessage = "Failed to create project.";
                    try {
                        if (xhr.responseText) {
                            var errorResponse = JSON.parse(xhr.responseText);
                            if (errorResponse.error && errorResponse.error.message) {
                                errorMessage = errorResponse.error.message;
                            } else if (errorResponse.message) {
                                errorMessage = errorResponse.message; // fallback
                            }
                        }
                    } catch (e) {
                        console.error("Error parsing backend error response:", e);
                    }

                    sap.m.MessageToast.show(errorMessage);
                    //sap.m.MessageBox();
                    console.error("AJAX Error:", status, error, xhr.responseText);
                }

            });


        },

        onNewProClear: function () {
            var oView = this.getView();
            oView.byId("inputProjectName").setValue("");
            oView.byId("startDate").setDateValue(null);
            oView.byId("endDate").setDateValue(null);
            oView.byId("EmployeeCombo").removeAllSelectedItems();

            console.log("Cleared")
        },
        // refreshTable: function () {

        //     var oTable = this.getView().byId("idProjectsTable");
        //     var oBinding = oTable.getBinding("items");

        //     if (oBinding) {
        //         oBinding.refresh(); 
        //     } else {
        //         console.warn("Table binding not found. Unable to refresh.");
        //     }
        // },
        refreshProTable: function () {
            try {
                var oTable = this.getView().byId("idProjectsTable");
                if (!oTable) {
                    throw new Error("Table 'idProjectsTable' not found in view.");
                }

                var oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.refresh();
                } else {
                    console.warn("Table binding not found. Unable to refresh.");
                }
            } catch (e) {
                console.error("Error refreshing project table:", e);
                MessageToast.show("Could not refresh the project list.");
            }
        },

        refreshEmpTable: function () {
            try {
                var oTable = this.getView().byId("idEmployeesTable");
                if (!oTable) {
                    throw new Error("Table 'idEmployeesTable' not found in view.");
                }

                var oBinding = oTable.getBinding("items");
                if (oBinding) {
                    oBinding.refresh();
                } else {
                    console.warn("Table binding not found. Unable to refresh.");
                }
            } catch (e) {
                console.error("Error refreshing project table:", e);
                MessageToast.show("Could not refresh the project list.");
            }
        },

        _refreshingTables: function () {
            console.log("Button Clicked");
            this.refreshProTable();
            // MessageToast.show("sdfgh");

        },

        // onNewProjectClose: function () {
        //     this.byId("newProjectDialog").close();
        // }



        onSearchProName: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue").toLowerCase();
            var oFilter = new sap.ui.model.Filter({
                path: "projectName",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sQuery,
                caseSensitive: false
            });

            // var oBinding = this.getOwnerComponent().getModel().bindList("/Projects", undefined, undefined, [oFilter]);

            // oBinding.requestContexts().then(function (aContexts) {
            //     aContexts.forEach(function (oContext) {
            //         var oData = oContext.getObject();
            //         console.log(oData);
            //     });
            // }).catch(function (oError) {
            //     console.error("Error fetching data:", oError);
            // });

            var oTable = this.byId("idProjectsTable");
            var oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter(sQuery ? [oFilter] : []);
            }

            // Optional logging
            console.log("Filter applied:", sQuery);
        },
    
        onSearchFullName: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue").toLowerCase();
            var oTable = this.byId("idEmployeesTable");
            var oItemsBinding = oTable.getBinding("items");
        
            var oFilter = new sap.ui.model.Filter({
                path: "fullName",
                operator: sap.ui.model.FilterOperator.Contains,
                value1: sQuery,
                caseSensitive: false 
            });
        
            if (oItemsBinding) {
                oItemsBinding.filter(sQuery ? [oFilter] : []);
            }
        }
        





    });
});