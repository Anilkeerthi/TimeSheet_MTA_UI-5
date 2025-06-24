// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ], (Controller) => {
//     "use strict";

//     return Controller.extend("project1.controller.Employee", {
//         onInit() {

//             const oModel = this.getOwnerComponent().getModel();
//             this.getView().setModel(oModel,"employeeModel");
//             console.log("Employee model set.",oModel);

//         }
//     });
// });


sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/Popover",
    "sap/m/TextArea",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Label",
    "sap/m/ColumnListItem",
    "sap/m/ComboBox",
    "sap/ui/core/Item",
    "sap/m/Text",
    "sap/ui/unified/CalendarDateInterval",
    "sap/m/Toolbar",
    "sap/m/ToolbarSpacer",
    "sap/m/Title",
    "sap/m/Bar"
], function (
    Controller, JSONModel, MessageToast, MessageBox,
    Input, Button, Popover, TextArea, Table, Column, Label,
    ColumnListItem, ComboBox, Item, Text,
    CalendarDateInterval, Toolbar, ToolbarSpacer, Title, Bar
) {
    "use strict";

    return Controller.extend("com.employee.employee.controller.Employee", {
        onInit: function () {

            const oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel, "oDatamodel");
            console.log(oModel);



            // try {
            //     const that = this;
            //     const today = new Date();
            //     const dayOfWeek = today.getDay();
            //     const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            //     const monday = new Date(today.setDate(today.getDate() + mondayOffset));

            //     const weekDates = Array.from({ length: 7 }, (_, i) => {
            //         const date = new Date(monday);
            //         date.setDate(monday.getDate() + i);
            //         return {
            //             day: date.toLocaleDateString('en-US', { weekday: 'short' }) + " " + date.getDate(),
            //             date: date.toISOString().split('T')[0],
            //             isWeekend: [0, 6].includes(date.getDay())
            //         };
            //     });

            //     const oWeekModel = new JSONModel({ week: weekDates });
            //     sap.ui.getCore().setModel(oWeekModel, "weekModel");
            //     const aWeekDays = oWeekModel.getProperty("/week");
            //     const oSubSection = this.byId("EmployeeTimesheettable");

            //     const oTable = new Table({ fixedLayout: false });

            //     ["Project", "Activity"].forEach(label => {
            //         oTable.addColumn(new Column({ header: new Label({ text: label }) }));
            //     });

            //     aWeekDays.forEach(day => {
            //         oTable.addColumn(new Column({
            //             header: new Label({ text: day.day }),
            //             styleClass: day.isWeekend ? "weekendColumn" : ""
            //         }));
            //     });

            //     oTable.addColumn(new Column({ header: new Label({ text: "Total" }) }));

            //     // function buildComboBoxCell(fieldName, staticItems) {
            //     //     if (Array.isArray(staticItems)) {
            //     //         return new ComboBox({
            //     //             width: "100px",
            //     //             items: staticItems.map(item => new Item({ key: item, text: item }))
            //     //         });
            //     //     } else {
            //     //         return new ComboBox({
            //     //             //selectedKey: `{timesheet>${fieldName}}`,
            //     //             width: "100px",
            //     //             items: {
            //     //                 path: "/Projects",
            //     //                 template: new Item({ key: "{ID}", text: "{projectName}" })
            //     //             }
            //     //         });
            //     //     }
            //     // }

            //     function buildDayInputCell(dayObj) {
            //         return new sap.m.HBox({
            //             items: [
            //                 new Input({
            //                     value: `{timesheet>${dayObj.date}}`,
            //                     width: "50px",
            //                     editable: !dayObj.isWeekend,
            //                     valueState: dayObj.isWeekend ? "Warning" : "None",
            //                     valueStateText: dayObj.isWeekend ? "Weekend" : "",
            //                     change: function () {
            //                         try {
            //                             const oModel = that.getView().getModel("timesheet");
            //                             const aData = oModel.getProperty("/");
            //                             let total = 0;
            //                             aWeekDays.forEach(day => {
            //                                 const value = aData[0][day.date];
            //                                 if (value && !isNaN(parseFloat(value))) {
            //                                     total += parseFloat(value);
            //                                 }
            //                             });
            //                             aData[0].Total = total;
            //                             oModel.setProperty("/", aData);
            //                         } catch (err) {
            //                             MessageToast.show("Error calculating total: " + err.message);
            //                             console.error(err);
            //                         }
            //                     }
            //                 }),
            //                 new Button({
            //                     icon: "sap-icon://comment",
            //                     tooltip: "Comment",
            //                     type: "Transparent",
            //                     enabled: !dayObj.isWeekend,
            //                     press: function (oEvent) {
            //                         try {
            //                             const oTextArea = new sap.m.TextArea({
            //                                 width: "300px",
            //                                 rows: 2,
            //                                 placeholder: "Enter your comment..."

            //                             });
            //                             const oButton = oEvent.getSource();
            //                             const oContext = oButton.getBindingContext("timesheet");
            //                             const sPath = oContext.getPath(); // e.g., "/0"
            //                             const oModel = oContext.getModel();
            //                             const oPopover = new Popover({
            //                                 title: `Add Note - ${dayObj.date}`,
            //                                 placement: "Top",
            //                                 content: [oTextArea],
            //                                 endButton: new Button({
            //                                     icon: "sap-icon://decline",
            //                                     press: () => oPopover.close()
            //                                 }),
            //                                 footer: new Bar({
            //                                     contentRight: [
            //                                         new Button({
            //                                             text: "Save",
            //                                             icon: "sap-icon://save",
            //                                             press: () => {
            //                                                 const sComment = oTextArea.getValue();
            //                                                 oModel.setProperty(`${sPath}/${dayObj.date}_comment`, sComment);
            //                                                 oPopover.close();
            //                                             }
            //                                         })
            //                                     ]
            //                                 })
            //                             });
            //                             oPopover.openBy(oButton);
            //                         } catch (err) {
            //                             MessageToast.show("Error opening comment popover: " + err.message);
            //                             console.error(err);
            //                         }
            //                     }
            //                 })
            //             ],
            //             alignItems: "Center",
            //             justifyContent: "Start"
            //         });
            //     }

            //     // const oItemTemplate = new ColumnListItem({
            //     //     cells: [
            //     //         new ComboBox({
            //     //             width: "100px",
            //     //             items: {
            //     //                 path: "/Projects",
            //     //                 template: new sap.ui.core.ListItem({ key: "{ID}", text: "{projectName}" })
            //     //             },
            //     //             firehange: function (oEvent) {
            //     //                 console.log(oEvent)
            //     //             }
            //     //         }),

            //     //         new ComboBox({
            //     //             width: "100px",
            //     //             items: [
            //     //                 new Item({ key: "In_Office", text: "In Office" }),
            //     //                 new Item({ key: "Remote", text: "Remote" }),
            //     //                 new Item({ key: "On_Leave", text: "On Leave" })
            //     //             ]
            //     //         }),
            //     //         //buildComboBoxCell("Activity", ["In Office", "Client location/Onsite", "Remote"]),
            //     //         ...aWeekDays.map(buildDayInputCell),
            //     //         new Text({ text: "{timesheet>Total}" })
            //     //     ]

            //     // });


            //     // First ComboBox - Project ComboBox
            //     const oProjectComboBox = new ComboBox({
            //         selectedKey: "{timesheet>Project}",
            //         width: "100px",
            //         items: {
            //             path: "/Projects",  // Use model name here
            //             template: new sap.ui.core.ListItem({
            //                 key: "{ID}",     // Also prefix in template bindings
            //                 text: "{projectName}"
            //             })
            //         },
            //         change: function (oEvent) {
            //             console.log(oEvent);
            //         }
            //     });

            //     console.log(oProjectComboBox)

            //     // Second ComboBox - Mode ComboBox
            //     const oModeComboBox = new ComboBox({
            //         selectedKey: "{timesheet>Activity}",
            //         width: "100px",
            //         items: [
            //             new Item({ key: "In_Office", text: "In Office" }),
            //             new Item({ key: "Remote", text: "Remote" }),
            //             new Item({ key: "On_Leave", text: "On Leave" })
            //         ],

            //     });

            //     // ColumnListItem Template
            //     const oItemTemplate = new ColumnListItem({
            //         cells: [
            //             oProjectComboBox,
            //             oModeComboBox,
            //             // Assuming buildDayInputCell returns UI controls (Input/Text/ComboBox etc.)
            //             ...aWeekDays.map(buildDayInputCell),
            //             new Text({ text: "{timesheet>Total}" })
            //         ]
            //     });


            //     const oTimesheetData = [{ Project: "", Activity: "", Total: 0 }];
            //     aWeekDays.forEach(day => { oTimesheetData[0][day.date] = ""; });

            //     const oTimesheetModel = new JSONModel(oTimesheetData);
            //     this.getView().setModel(oTimesheetModel, "timesheet");

            //     oTable.bindItems({
            //         path: "timesheet>/",
            //         template: oItemTemplate
            //     });

            //     const oAddButton = new Button({
            //         text: "Add Row",
            //         icon: "sap-icon://add",
            //         press: function () {
            //             try {
            //                 const oModel = that.getView().getModel("timesheet");
            //                 const aData = oModel.getProperty("/");
            //                 const oNewRow = { Project: "", Activity: "", Total: 0 };
            //                 aWeekDays.forEach(day => { oNewRow[day.date] = ""; });
            //                 aData.push(oNewRow);
            //                 oModel.setProperty("/", aData);
            //             } catch (err) {
            //                 MessageToast.show("Error adding row: " + err.message);
            //                 console.error(err);
            //             }
            //         }
            //     });

            //     this.oDateIntravel = new CalendarDateInterval({
            //         startDate: monday,
            //         width: "400px",
            //         select: function (oEvent) {
            //             try {
            //                 console.log("Selected date:", oEvent.getParameter("startDate"));
            //             } catch (err) {
            //                 MessageToast.show("Error in calendar selection: " + err.message);
            //             }
            //         }
            //     });

            //     this.oPopover = new Popover({
            //         title: "Select Date",
            //         contentWidth: "auto",
            //         contentHeight: "auto",
            //         placement: sap.m.PlacementType.Bottom,
            //         content: [this.oDateIntravel]
            //     });

            //     const oCalendarButton = new Button({
            //         icon: "sap-icon://calendar",
            //         press: oEvent => this.oPopover.openBy(oEvent.getSource())
            //     });

            //     oTable.setHeaderToolbar(new Toolbar({
            //         content: [
            //             new Title({ text: "Weekly Timesheet", level: "H2" }),
            //             new ToolbarSpacer(),
            //             oCalendarButton,
            //             oAddButton,
            //             new Button({
            //                 text: "Save",
            //                 type: "Emphasized",
            //                 // press: function () {
            //                 //     try {
            //                 //         const oView = that.getView();
            //                 //         const aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
            //                 //         const aTableData = oView.getModel("timesheet").getProperty("/");

            //                 //         const sEmployeeID = "12d9eaf7-10e5-4ad0-a98a-37504f42a7e5";
            //                 //         const sProjectID = "13c447e9-bed3-4ec7-8654-2c9909f8d005";
            //                 //         const aTimesheetPayload = [];

            //                 //         aTableData.forEach(row => {
            //                 //             if (!row.Project || !row.Activity) return;
            //                 //             const aEntries = aWeekDays.reduce((entries, day) => {
            //                 //                 const hours = row[day.date];
            //                 //                 if (hours && !isNaN(parseFloat(hours))) {
            //                 //                     entries.push({ workDate: day.date, hoursWorked: parseFloat(hours) });
            //                 //                 }
            //                 //                 return entries;
            //                 //             }, []);

            //                 //             if (aEntries.length > 0) {
            //                 //                 aTimesheetPayload.push({
            //                 //                     employeeID: sEmployeeID,
            //                 //                     projectID: sProjectID,
            //                 //                     activity: row.Activity,
            //                 //                     entries: aEntries
            //                 //                 });
            //                 //             }
            //                 //         });

            //                 //         if (aTimesheetPayload.length === 0) {
            //                 //             MessageToast.show("Please fill in valid timesheet data.");
            //                 //             return;
            //                 //         }

            //                 //         $.ajax({
            //                 //             url: "/odata/v4/timesheet/SubmitWeeklyTimeSheet",
            //                 //             method: "POST",
            //                 //             contentType: "application/json",
            //                 //             dataType: "json",
            //                 //             data: JSON.stringify({ data: aTimesheetPayload }),
            //                 //             success: () => MessageToast.show("Timesheet submitted successfully!"),
            //                 //             error: function (xhr) {
            //                 //                 let errorMessage = "Failed to submit timesheet.";
            //                 //                 try {
            //                 //                     const response = JSON.parse(xhr.responseText);
            //                 //                     errorMessage = response.error?.message || response.message || errorMessage;
            //                 //                 } catch (e) {
            //                 //                     console.error("Error parsing backend error response:", e);
            //                 //                 }
            //                 //                 MessageToast.show(errorMessage);
            //                 //             }
            //                 //         });
            //                 //     } catch (err) {
            //                 //         MessageToast.show("Unexpected error during save: " + err.message);
            //                 //         console.error(err);
            //                 //     }
            //                 // }
            //                 press: function () {
            //                     try {
            //                         const oView = that.getView(); // use 'this' instead of 'that' if context is correct
            //                         const aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
            //                         const aTableData = oView.getModel("timesheet").getProperty("/");

            //                         const sEmployeeID = "12d9eaf7-10e5-4ad0-a98a-37504f42a7e5";
            //                         const sProjectID = "13c447e9-bed3-4ec7-8654-2c9909f8d005";
            //                         const aTimesheetPayload = [];

            //                         aTableData.forEach(row => {
            //                             if (!row.Project || !row.Activity) return;

            //                             const aEntries = aWeekDays.reduce((entries, day) => {
            //                                 const hours = row[day.date];
            //                                 const comment = row[`${day.date}_comment`] || "";
            //                                 if (hours && !isNaN(parseFloat(hours))) {
            //                                     entries.push({
            //                                         workDate: day.date,
            //                                         hoursWorked: parseFloat(hours),
            //                                         comments: comment // Optional: add comment per row
            //                                     });
            //                                 }
            //                                 return entries;
            //                             }, []);

            //                             if (aEntries.length > 0) {
            //                                 aTimesheetPayload.push({
            //                                     employeeID: sEmployeeID,
            //                                     projectID: sProjectID,
            //                                     activity: row.Activity,
            //                                     entries: aEntries
            //                                 });
            //                             }
            //                         });

            //                         if (aTimesheetPayload.length === 0) {
            //                             MessageToast.show("Please fill in valid timesheet data.");
            //                             return;
            //                         }

            //                         // Fire AJAX call to CAP OData action
            //                         $.ajax({
            //                             url: "/odata/v4/timesheet/SubmitWeeklyTimeSheet",
            //                             method: "POST",
            //                             contentType: "application/json",
            //                             dataType: "json",
            //                             data: JSON.stringify({ data: aTimesheetPayload }),
            //                             success: () => {
            //                                 MessageToast.show("Timesheet submitted successfully!");
            //                             },
            //                             error: function (xhr) {
            //                                 let errorMessage = "Failed to submit timesheet.";
            //                                 try {
            //                                     const response = JSON.parse(xhr.responseText);
            //                                     errorMessage = response?.error?.message || response?.message || errorMessage;
            //                                 } catch (e) {
            //                                     console.error("Error parsing backend error response:", e);
            //                                 }
            //                                 MessageToast.show(errorMessage);
            //                             }
            //                         });

            //                     } catch (err) {
            //                         MessageToast.show("Unexpected error during save: " + err.message);
            //                         console.error("Unhandled exception:", err);
            //                     }
            //                 }

            //             })
            //         ]
            //     }));

            //     oSubSection.addBlock(oTable);
            // } 
            try {
                // Creating a model with Present week days
                const that = this;
                const today = new Date();
                const dayOfWeek = today.getDay();
                const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const monday = new Date(today.setDate(today.getDate() + mondayOffset));

                const weekDates = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(monday);
                    date.setDate(monday.getDate() + i);
                    return {
                        day: date.toLocaleDateString('en-US', { weekday: 'short' }) + " " + date.getDate(),
                        date: date.toISOString().split('T')[0],
                        isWeekend: [0, 6].includes(date.getDay())
                    };
                });

                const oWeekModel = new JSONModel({ week: weekDates });
                sap.ui.getCore().setModel(oWeekModel, "weekModel");

                const aWeekDays = oWeekModel.getProperty("/week");
                const oSubSection = this.byId("EmployeeTimesheettable");

                // Creating the table
                const oTable = new Table({
                    fixedLayout: false
                });

                // Function to calculate and update footer totals
                function updateFooterTotals(aWeekDays, oTimesheetModel) {
                    try {
                        const aData = oTimesheetModel.getProperty("/");
                        let grandTotal = 0;

                        // Calculate totals for each day column
                        aWeekDays.forEach(day => {
                            let dayTotal = 0;

                            aData.forEach(row => {
                                const value = row[day.date];
                                if (value && !isNaN(parseFloat(value))) {
                                    dayTotal += parseFloat(value);
                                }
                            });

                            // Update the footer text for this day
                            const oFooterText = sap.ui.getCore().byId(`footer_${day.date}`);
                            if (oFooterText) {
                                oFooterText.setText(dayTotal.toFixed(1));
                            }

                            grandTotal += dayTotal;
                        });

                        // Update grand total
                        const oGrandTotalText = sap.ui.getCore().byId("footer_grand_total");
                        if (oGrandTotalText) {
                            oGrandTotalText.setText(grandTotal.toFixed(1));
                        }

                    } catch (err) {
                        console.error("Error updating footer totals:", err);
                    }
                }

                // Enhanced footer creation with column totals
                function createFooterWithTotals(aWeekDays, oTimesheetModel) {
                    const footerContent = [];

                    // Static label for "Totals"
                    footerContent.push(new Title({ text: "Total Hours:", width: "100px", class: "footerLabel" }));
                    footerContent.push(new ToolbarSpacer());

                    // Empty for Activity column
                    footerContent.push(new Text({ text: "", width: "100px" }));
                    footerContent.push(new ToolbarSpacer());

                    // Dynamic day columns with spacers in between
                    aWeekDays.forEach((day, index) => {
                        footerContent.push(new Text({
                            text: "0", // Initial
                            width: "70px",
                            textAlign: "Center",
                            id: `footer_${day.date}`,
                            class: day.isWeekend ? "weekendFooter" : "weekdayFooter"
                        }));

                        // Spacer between each day total
                        if (index < aWeekDays.length - 1) {
                            footerContent.push(new ToolbarSpacer());
                        }
                    });

                    // Spacer before grand total
                    footerContent.push(new ToolbarSpacer());

                    // Grand Total
                    footerContent.push(new Text({
                        text: "0",
                        width: "60px",
                        textAlign: "Center",
                        id: "footer_grand_total",
                        class: "grandTotalFooter"
                    }));

                    const oFooterBar = new Toolbar({
                        content: footerContent,
                        style: "Clear"
                    });

                    return oFooterBar;
                }


                // Static columns
                ["Project", "Activity"].forEach(label => {
                    oTable.addColumn(new Column({ header: new Label({ text: label }) }));
                });

                // Weekdays headers titles
                aWeekDays.forEach(day => {
                    oTable.addColumn(new Column({
                        header: new Label({ text: day.day }),
                        styleClass: day.isWeekend ? "weekendColumn" : ""
                    }));
                });

                // Total column 
                oTable.addColumn(new Column({ header: new Label({ text: "Total" }) }));

                // Setting whole data on TimeSheet Model
                const oTimesheetData = [{ Project: "", Activity: "", Total: 0 }];
                aWeekDays.forEach(day => { oTimesheetData[0][day.date] = ""; });

                const oTimesheetModel = new JSONModel(oTimesheetData);
                this.getView().setModel(oTimesheetModel, "timesheet");

                // InputBoxes for each day with enhanced change handler
                function buildDayInputCell(dayObj) {
                    return new sap.m.HBox({
                        items: [
                            new Input({
                                value: `{timesheet>${dayObj.date}}`,
                                width: "50px",
                                editable: !dayObj.isWeekend,
                                valueState: dayObj.isWeekend ? "Warning" : "None",
                                valueStateText: dayObj.isWeekend ? "Weekend" : "",
                                change: function (oEvent) {
                                    try {
                                        const oInput = oEvent.getSource();
                                        let sValue = oInput.getValue();
                                        let fValue = parseFloat(sValue);

                                        // Validate input
                                        if (isNaN(fValue) || fValue < 0) {
                                            fValue = 0;
                                        }

                                        // Cap value at 8
                                        if (fValue > 8) {
                                            fValue = 8;
                                            oInput.setValue("8");
                                            MessageToast.show("Value cannot be more than 8 hours.");
                                        }

                                        // Set editable based on value
                                        oInput.setEditable(fValue < 8);

                                        // Update model manually if needed
                                        const oModel = that.getView().getModel("timesheet");
                                        const oContext = oInput.getBindingContext("timesheet");
                                        const sPath = oContext.getPath(); // e.g., "/0"
                                        const sProp = oInput.getBindingPath("value"); // e.g., "2024-09-29"
                                        oModel.setProperty(`${sPath}/${sProp}`, fValue);

                                        // Recalculate row totals
                                        const aData = oModel.getProperty("/");
                                        aData.forEach(row => {
                                            let total = 0;
                                            aWeekDays.forEach(day => {
                                                const value = row[day.date];
                                                if (value && !isNaN(parseFloat(value))) {
                                                    total += parseFloat(value);
                                                }
                                            });
                                            row.Total = total;
                                        });
                                        oModel.setProperty("/", aData);

                                        // Update footer column totals
                                        updateFooterTotals(aWeekDays, oModel);

                                    } catch (err) {
                                        MessageToast.show("Error: " + err.message);
                                        console.error(err);
                                    }
                                }
                            }),
                            new Button({
                                icon: "sap-icon://comment",
                                tooltip: "Comment",
                                type: "Transparent",
                                enabled: !dayObj.isWeekend,
                                press: function (oEvent) {
                                    try {
                                        const oTextArea = new sap.m.TextArea({
                                            width: "300px",
                                            rows: 2,
                                            placeholder: "Enter your comment..."
                                        });
                                        const oButton = oEvent.getSource();
                                        const oContext = oButton.getBindingContext("timesheet");
                                        const sPath = oContext.getPath(); // e.g., "/0"
                                        const oModel = oContext.getModel();
                                        const oPopover = new Popover({
                                            title: `Add Note - ${dayObj.date}`,
                                            placement: "Top",
                                            content: [oTextArea],
                                            endButton: new Button({
                                                icon: "sap-icon://decline",
                                                press: () => oPopover.close()
                                            }),
                                            footer: new Bar({
                                                contentRight: [
                                                    new Button({
                                                        text: "Save",
                                                        icon: "sap-icon://save",
                                                        press: () => {
                                                            const sComment = oTextArea.getValue();
                                                            oModel.setProperty(`${sPath}/${dayObj.date}_comment`, sComment);
                                                            oPopover.close();
                                                        }
                                                    })
                                                ]
                                            })
                                        });
                                        oPopover.openBy(oButton);
                                    } catch (err) {
                                        MessageToast.show("Error opening comment popover: " + err.message);
                                        console.error(err);
                                    }
                                }
                            })
                        ],
                        alignItems: "Center",
                        justifyContent: "Start"
                    });
                }

                // First ComboBox - Project ComboBox
                const oProjectComboBox = new ComboBox({
                    selectedKey: "{timesheet>Project}",
                    width: "100px",
                    items: {
                        path: "/Projects",  // Use model name here
                        template: new sap.ui.core.ListItem({
                            key: "{ID}",     // Also prefix in template bindings
                            text: "{projectName}"
                        })
                    },
                    change: function (oEvent) {
                        console.log(oEvent);
                    }
                });

                console.log(oProjectComboBox);

                // Second ComboBox - Mode ComboBox
                const oModeComboBox = new ComboBox({
                    selectedKey: "{timesheet>Activity}",
                    width: "100px",
                    items: [
                        new Item({ key: "In_Office", text: "In Office" }),
                        new Item({ key: "Remote", text: "Remote" }),
                        new Item({ key: "On_Leave", text: "On Leave" })
                    ],
                });

                // ColumnListItem Template
                const oItemTemplate = new ColumnListItem({
                    cells: [
                        oProjectComboBox,
                        oModeComboBox,
                        // Assuming buildDayInputCell returns UI controls (Input/Text/ComboBox etc.)
                        ...aWeekDays.map(buildDayInputCell),
                        new Text({ text: "{timesheet>Total}" })
                    ]
                });

                oTable.bindItems({
                    path: "timesheet>/",
                    template: oItemTemplate
                });

                // Enhanced Add Button with footer update
                const oAddButton = new Button({
                    text: "Add Row",
                    icon: "sap-icon://add",
                    press: function () {
                        try {
                            const oModel = that.getView().getModel("timesheet");
                            const aData = oModel.getProperty("/");
                            const oNewRow = { Project: "", Activity: "", Total: 0 };
                            aWeekDays.forEach(day => { oNewRow[day.date] = ""; });
                            aData.push(oNewRow);
                            oModel.setProperty("/", aData);

                            // Update footer totals after adding row
                            updateFooterTotals(aWeekDays, oModel);
                        } catch (err) {
                            MessageToast.show("Error adding row: " + err.message);
                            console.error(err);
                        }
                    }
                });

                // Calendar functionality
                this.oDateIntreval = new CalendarDateInterval({
                    startDate: monday,
                    width: "400px",
                    select: function (oEvent) {
                        try {
                            console.log("Selected date:", oEvent.getParameter("startDate"));
                        } catch (err) {
                            MessageToast.show("Error in calendar selection: " + err.message);
                        }
                    }
                });

                this.oPopover = new Popover({
                    title: "Select Date",
                    contentWidth: "auto",
                    contentHeight: "auto",
                    placement: sap.m.PlacementType.Bottom,
                    content: [this.oDateIntreval]
                });

                const oCalendarButton = new Button({
                    icon: "sap-icon://calendar",
                    press: oEvent => this.oPopover.openBy(oEvent.getSource())
                });

                // Enhanced Save Button
                const oSaveButton = new Button({
                    text: "Save",
                    type: "Emphasized",
                    press: function () {
                        try {
                            const oView = that.getView();
                            const aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
                            const aTableData = oView.getModel("timesheet").getProperty("/");

                            //const sEmployeeID = "12d9eaf7-10e5-4ad0-a98a-37504f42a7e5";
                            const aTimesheetPayload = [];

                            aTableData.forEach(row => {
                                if (!row.Project || !row.Activity) return;

                                const aEntries = aWeekDays.reduce((entries, day) => {
                                    const hours = row[day.date];
                                    const comment = row[`${day.date}_comment`] || "";
                                    if (hours && !isNaN(parseFloat(hours))) {
                                        entries.push({
                                            workDate: day.date,
                                            hoursWorked: parseFloat(hours),
                                            comments: comment
                                        });
                                    }
                                    return entries;
                                }, []);

                                if (aEntries.length > 0) {
                                    aTimesheetPayload.push({
                                        employeeID: row.Project,
                                        projectID: row.Project, // dynamic from combo box selection
                                        activity: row.Activity,
                                        entries: aEntries
                                    });
                                }
                            });

                            if (aTimesheetPayload.length === 0) {
                                MessageToast.show("Please fill in valid timesheet data.");
                                return;
                            }

                            $.ajax({
                                url: "/odata/v4/timesheet/SubmitWeeklyTimeSheet",
                                method: "POST",
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify({ data: aTimesheetPayload }),
                                success: (response) => {
                                    console.log("Timesheet submitted successfully. Response from backend:", response);
                                    MessageToast.show("Timesheet submitted successfully!");
                                },
                                error: function (xhr) {
                                    let errorMessage = "Failed to submit timesheet.";
                                    try {
                                        const response = JSON.parse(xhr.responseText);
                                        errorMessage = response?.error?.message || response?.message || errorMessage;

                                        console.error("Error response from backend:", response);
                                    } catch (e) {
                                        console.error("Error parsing backend error response:", e);
                                    }
                                    MessageToast.show(errorMessage);
                                }
                            });

                        } catch (err) {
                            MessageToast.show("Unexpected error during save: " + err.message);
                            console.error("Unhandled exception:", err);
                        }
                    }
                });

                // Table Header Toolbar
                oTable.setHeaderToolbar(new Toolbar({
                    content: [
                        new Title({ text: "Weekly Timesheet", level: "H2" }),
                        new ToolbarSpacer(),
                        oCalendarButton,
                        oAddButton,
                        oSaveButton
                    ]
                }));

                // Create footer with column totals
                const oFooterBar = createFooterWithTotals(aWeekDays, oTimesheetModel);

                // Create VBox with table and enhanced footer
                const oVBox = new sap.m.VBox({
                    items: [
                        oTable,
                        oFooterBar
                    ]
                });

                oSubSection.addBlock(oVBox);

                // Initial calculation of footer totals
                setTimeout(() => {
                    updateFooterTotals(aWeekDays, oTimesheetModel);
                }, 100);
            }
            // {

            //     //Creating an model with Present week days
            //     const that = this;
            //     const today = new Date();
            //     const dayOfWeek = today.getDay();
            //     const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            //     const monday = new Date(today.setDate(today.getDate() + mondayOffset));

            //     const weekDates = Array.from({ length: 7 }, (_, i) => {
            //         const date = new Date(monday);
            //         date.setDate(monday.getDate() + i);
            //         return {
            //             day: date.toLocaleDateString('en-US', { weekday: 'short' }) + " " + date.getDate(),
            //             date: date.toISOString().split('T')[0],
            //             isWeekend: [0, 6].includes(date.getDay())
            //         };
            //     });

            //     const oWeekModel = new JSONModel({ week: weekDates });
            //     sap.ui.getCore().setModel(oWeekModel, "weekModel");

            //     const aWeekDays = oWeekModel.getProperty("/week");
            //     const oSubSection = this.byId("EmployeeTimesheettable");


            //     //Creating an table
            //     // const oTable = new Table({ fixedLayout: false,
            //     //     footerToolbar: new sap.m.Toolbar({ content: [ new Title({ text: "Timesheet" }) ] })
            //     //  });

            //     //Creating the table with footer
            //     const oTable = new Table({
            //         fixedLayout: false
            //     });

            //     const oFooterBar = new Toolbar({
            //         content: [
            //             new Text({ text: "Total Hours", id: "footerTotal" })
            //         ]
            //     });


            //     // Static columns
            //     ["Project", "Activity"].forEach(label => {
            //         oTable.addColumn(new Column({ header: new Label({ text: label }) }));
            //     });


            //     //Weekdays headers titles
            //     aWeekDays.forEach(day => {
            //         oTable.addColumn(new Column({
            //             header: new Label({ text: day.day }),
            //             styleClass: day.isWeekend ? "weekendColumn" : ""
            //         }));
            //     });

            //     //Total column 
            //     oTable.addColumn(new Column({ header: new Label({ text: "Total" }) }));

            //     // Setting whole data on TimeSheet Model
            //     const oTimesheetData = [{ Project: "", Activity: "", Total: 0 }];
            //     aWeekDays.forEach(day => { oTimesheetData[0][day.date] = ""; });

            //     const oTimesheetModel = new JSONModel(oTimesheetData);
            //     this.getView().setModel(oTimesheetModel, "timesheet");




            //     //InputBoxes for each day
            //     function buildDayInputCell(dayObj) {
            //         return new sap.m.HBox({
            //             items: [
            //                 new Input({
            //                     value: `{timesheet>${dayObj.date}}`,
            //                     width: "50px",
            //                     editable: !dayObj.isWeekend,
            //                     valueState: dayObj.isWeekend ? "Warning" : "None",
            //                     valueStateText: dayObj.isWeekend ? "Weekend" : "",
            //                     change: function (oEvent) {
            //                         try {
            //                             const oInput = oEvent.getSource();
            //                             let sValue = oInput.getValue();
            //                             let fValue = parseFloat(sValue);

            //                             // Validate input
            //                             if (isNaN(fValue) || fValue < 0) {
            //                                 fValue = 0;
            //                             }

            //                             // Cap value at 8
            //                             if (fValue > 8) {
            //                                 fValue = 8;
            //                                 oInput.setValue("0");
            //                                 MessageToast.show("Value cannot be more than 8 hours.");
            //                             }

            //                             // Set editable based on value
            //                             oInput.setEditable(fValue < 8);

            //                             // Update model manually if needed
            //                             const oModel = that.getView().getModel("timesheet");
            //                             const oContext = oInput.getBindingContext("timesheet");
            //                             const sPath = oContext.getPath(); // e.g., "/0"
            //                             const sProp = oInput.getBindingPath("value"); // e.g., "2024-09-29"
            //                             oModel.setProperty(`${sPath}/${sProp}`, fValue);

            //                             // Recalculate total

            //                             const aData = oModel.getProperty("/");
            //                             aData.forEach(row => {
            //                                 let total = 0;
            //                                 aWeekDays.forEach(day => {
            //                                     const value = row[day.date];
            //                                     if (value && !isNaN(parseFloat(value))) {
            //                                         total += parseFloat(value);
            //                                     }
            //                                 });
            //                                 row.Total = total;
            //                             });
            //                             oModel.setProperty("/", aData);

            //                             // const aData = oModel.getProperty("/");
            //                             // let total = 0;
            //                             // aWeekDays.forEach(day => {
            //                             //     const value = aData[1][day.date];
            //                             //     if (value && !isNaN(parseFloat(value))) {
            //                             //         total += parseFloat(value);
            //                             //     }
            //                             // });
            //                             // aData[0].Total = total;
            //                             // oModel.setProperty("/", aData);
            //                         } catch (err) {
            //                             MessageToast.show("Error: " + err.message);
            //                             console.error(err);
            //                         }
            //                     }
            //                 }),
            //                 new Button({
            //                     icon: "sap-icon://comment",
            //                     tooltip: "Comment",
            //                     type: "Transparent",
            //                     enabled: !dayObj.isWeekend,
            //                     press: function (oEvent) {
            //                         try {
            //                             const oTextArea = new sap.m.TextArea({
            //                                 width: "300px",
            //                                 rows: 2,
            //                                 placeholder: "Enter your comment..."

            //                             });
            //                             const oButton = oEvent.getSource();
            //                             const oContext = oButton.getBindingContext("timesheet");
            //                             const sPath = oContext.getPath(); // e.g., "/0"
            //                             const oModel = oContext.getModel();
            //                             const oPopover = new Popover({
            //                                 title: `Add Note - ${dayObj.date}`,
            //                                 placement: "Top",
            //                                 content: [oTextArea],
            //                                 endButton: new Button({
            //                                     icon: "sap-icon://decline",
            //                                     press: () => oPopover.close()
            //                                 }),
            //                                 footer: new Bar({
            //                                     contentRight: [
            //                                         new Button({
            //                                             text: "Save",
            //                                             icon: "sap-icon://save",
            //                                             press: () => {
            //                                                 const sComment = oTextArea.getValue();
            //                                                 oModel.setProperty(`${sPath}/${dayObj.date}_comment`, sComment);
            //                                                 oPopover.close();
            //                                             }
            //                                         })
            //                                     ]
            //                                 })
            //                             });
            //                             oPopover.openBy(oButton);
            //                         } catch (err) {
            //                             MessageToast.show("Error opening comment popover: " + err.message);
            //                             console.error(err);
            //                         }
            //                     }
            //                 })
            //             ],
            //             alignItems: "Center",
            //             justifyContent: "Start"
            //         });
            //     }


            //     // First ComboBox - Project ComboBox
            //     const oProjectComboBox = new ComboBox({
            //         selectedKey: "{timesheet>Project}",
            //         width: "100px",
            //         items: {
            //             path: "/Projects",  // Use model name here
            //             template: new sap.ui.core.ListItem({
            //                 key: "{ID}",     // Also prefix in template bindings
            //                 text: "{projectName}"
            //             })
            //         },
            //         change: function (oEvent) {
            //             console.log(oEvent);
            //         }
            //     });

            //     console.log(oProjectComboBox)

            //     // Second ComboBox - Mode ComboBox
            //     const oModeComboBox = new ComboBox({
            //         selectedKey: "{timesheet>Activity}",
            //         width: "100px",
            //         items: [
            //             new Item({ key: "In_Office", text: "In Office" }),
            //             new Item({ key: "Remote", text: "Remote" }),
            //             new Item({ key: "On_Leave", text: "On Leave" })
            //         ],

            //     });

            //     // ColumnListItem Template
            //     const oItemTemplate = new ColumnListItem({
            //         cells: [
            //             oProjectComboBox,
            //             oModeComboBox,
            //             // Assuming buildDayInputCell returns UI controls (Input/Text/ComboBox etc.)
            //             ...aWeekDays.map(buildDayInputCell),
            //             new Text({ text: "{timesheet>Total}" })
            //         ]
            //     });
            //     oTable.bindItems({
            //         path: "timesheet>/",
            //         template: oItemTemplate
            //     });

            //     const oAddButton = new Button({
            //         text: "Add Row",
            //         icon: "sap-icon://add",
            //         press: function () {
            //             try {
            //                 const oModel = that.getView().getModel("timesheet");
            //                 const aData = oModel.getProperty("/");
            //                 const oNewRow = { Project: "", Activity: "", Total: 0 };
            //                 aWeekDays.forEach(day => { oNewRow[day.date] = ""; });
            //                 aData.push(oNewRow);
            //                 oModel.setProperty("/", aData);
            //             } catch (err) {
            //                 MessageToast.show("Error adding row: " + err.message);
            //                 console.error(err);
            //             }
            //         }
            //     });

            //     this.oDateIntravel = new CalendarDateInterval({
            //         startDate: monday,
            //         width: "400px",
            //         select: function (oEvent) {
            //             try {
            //                 console.log("Selected date:", oEvent.getParameter("startDate"));
            //             } catch (err) {
            //                 MessageToast.show("Error in calendar selection: " + err.message);
            //             }
            //         }
            //     });

            //     this.oPopover = new Popover({
            //         title: "Select Date",
            //         contentWidth: "auto",
            //         contentHeight: "auto",
            //         placement: sap.m.PlacementType.Bottom,
            //         content: [this.oDateIntravel]
            //     });

            //     const oCalendarButton = new Button({
            //         icon: "sap-icon://calendar",
            //         press: oEvent => this.oPopover.openBy(oEvent.getSource())
            //     });


            //     oTable.setHeaderToolbar(new Toolbar({
            //         content: [
            //             new Title({ text: "Weekly Timesheet", level: "H2" }),
            //             new ToolbarSpacer(),
            //             oCalendarButton,
            //             oAddButton,
            //             new Button({
            //                 text: "Save",
            //                 type: "Emphasized",

            //                 press: function () {
            //                     try {
            //                         const oView = that.getView();
            //                         const aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
            //                         const aTableData = oView.getModel("timesheet").getProperty("/");

            //                         const sEmployeeID = "12d9eaf7-10e5-4ad0-a98a-37504f42a7e5";
            //                         const aTimesheetPayload = [];

            //                         aTableData.forEach(row => {
            //                             if (!row.Project || !row.Activity) return;

            //                             const aEntries = aWeekDays.reduce((entries, day) => {
            //                                 const hours = row[day.date];
            //                                 const comment = row[`${day.date}_comment`] || "";
            //                                 if (hours && !isNaN(parseFloat(hours))) {
            //                                     entries.push({
            //                                         workDate: day.date,
            //                                         hoursWorked: parseFloat(hours),
            //                                         comments: comment
            //                                     });
            //                                 }
            //                                 return entries;
            //                             }, []);

            //                             if (aEntries.length > 0) {
            //                                 aTimesheetPayload.push({
            //                                     employeeID: sEmployeeID,
            //                                     projectID: row.Project, // dynamic from combo box selection
            //                                     activity: row.Activity,
            //                                     entries: aEntries
            //                                 });
            //                             }
            //                         });

            //                         if (aTimesheetPayload.length === 0) {
            //                             MessageToast.show("Please fill in valid timesheet data.");
            //                             return;
            //                         }

            //                         $.ajax({
            //                             url: "/odata/v4/timesheet/SubmitWeeklyTimeSheet",
            //                             method: "POST",
            //                             contentType: "application/json",
            //                             dataType: "json",
            //                             data: JSON.stringify({ data: aTimesheetPayload }),
            //                             success: () => {
            //                                 MessageToast.show("Timesheet submitted successfully!");
            //                             },
            //                             error: function (xhr) {
            //                                 let errorMessage = "Failed to submit timesheet.";
            //                                 try {
            //                                     const response = JSON.parse(xhr.responseText);
            //                                     errorMessage = response?.error?.message || response?.message || errorMessage;
            //                                 } catch (e) {
            //                                     console.error("Error parsing backend error response:", e);
            //                                 }
            //                                 MessageToast.show(errorMessage);
            //                             }
            //                         });

            //                     } catch (err) {
            //                         MessageToast.show("Unexpected error during save: " + err.message);
            //                         console.error("Unhandled exception:", err);
            //                     }
            //                 }


            //             })
            //         ]
            //     }));

            //     const oVBox = new sap.m.VBox({
            //         items: [
            //             oTable,
            //             oFooterBar
            //         ]
            //     });


            //     oSubSection.addBlock(oVBox);

            // }
            catch (err) {
                MessageToast.show("Initialization error: " + err.message);
                console.error(err);
            }
        },

        tableRefresh: function () {
            try {
                const oTable = this.getView().byId("idTimeTable");
                const oBinding = oTable?.getBinding("items");
                oBinding ? oBinding.refresh() : console.warn("Table binding not found. Unable to refresh.");
            } catch (err) {
                MessageToast.show("Error refreshing table: " + err.message);
                console.error(err);
            }
        }
    });
});
