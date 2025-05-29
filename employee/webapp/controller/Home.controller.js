// sap.ui.define([
//     "sap/ui/core/mvc/Controller"
// ], (Controller) => {
//     "use strict";

//     return Controller.extend("com.employee.employee.controller.Home", {
//         onInit() {
//             const that = this;

//             const today = new Date();
//             const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
//             const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
//             const monday = new Date(today);
//             monday.setDate(today.getDate() + mondayOffset);

//             const weekDates = [];
//             for (let i = 0; i < 7; i++) {
//                 const date = new Date(monday);
//                 date.setDate(monday.getDate() + i);
//                 weekDates.push({
//                     day: date.toLocaleDateString('en-US', { weekday: 'short' }) + " " + date.getDate(),
//                     date: date.toISOString().split('T')[0],
//                     isWeekend: (date.getDay() === 0 || date.getDay() === 6)
//                 });
//             }

//             const oWeekModel = new sap.ui.model.json.JSONModel({ week: weekDates });
//             sap.ui.getCore().setModel(oWeekModel, "weekModel");

//             const aWeekDays = oWeekModel.getProperty("/week");
//             const oSubSection = this.byId("EmployeeTimesheettable");

//             const oTable = new sap.m.Table({
//                 fixedLayout: false
//             });

//             // Add columns: Project, Activity
//             ["Project", "Activity"].forEach(function (label) {
//                 oTable.addColumn(new sap.m.Column({
//                     header: new sap.m.Label({ text: label })
//                 }));
//             });

//             // Add weekday columns
//             aWeekDays.forEach(function (dayObj) {
//                 oTable.addColumn(new sap.m.Column({
//                     header: new sap.m.Label({ text: dayObj.day }),
//                     styleClass: dayObj.isWeekend ? "weekendColumn" : ""
//                 }));
//             });

//             // Add total column
//             oTable.addColumn(new sap.m.Column({
//                 header: new sap.m.Label({ text: "Total" })
//             }));


//             function buildComboBoxCell(fieldName, staticItems) {
//                 if (staticItems && Array.isArray(staticItems)) {
//                     // For static values like "Activity"
//                     return new sap.m.ComboBox({
//                         width: "100px",
//                         items: staticItems.map(item => new sap.ui.core.Item({
//                             key: item,
//                             text: item
//                         }))
//                     });
//                 } else {
//                     // For dynamic binding like "Projects"
//                     return new sap.m.ComboBox({
//                         selectedKey: "{timesheet>" + fieldName + "}", // optional binding
//                         width: "100px",
//                         items: {
//                             path: "/Projects",
//                             template: new sap.ui.core.Item({
//                                 key: "{projectName}",
//                                 text: "{projectName}"
//                             })
//                         }
//                     });
//                 }
//             }



//             const buildDayInputCell = function (dayObj) {
//                 return new sap.m.HBox({
//                     items: [
//                         new sap.m.Input({
//                             value: "{timesheet>" + dayObj.date + "}",
//                             width: "50px",
//                             editable: !dayObj.isWeekend,
//                             valueState: dayObj.isWeekend ? "Warning" : "None",
//                             valueStateText: dayObj.isWeekend ? "Weekend" : "",
//                             change: function () {
//                                 const oModel = that.getView().getModel("timesheet");
//                                 const aData = oModel.getProperty("/");
//                                 let total = 0;
//                                 const aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
//                                 aWeekDays.forEach(function (day) {
//                                     const value = aData[0][day.date];
//                                     if (value && !isNaN(parseFloat(value))) {
//                                         total += parseFloat(value);
//                                     }
//                                 });
//                                 aData[0].Total = total;
//                                 oModel.setProperty("/", aData);
//                             }
//                         }),
//                         new sap.m.Button({
//                             icon: "sap-icon://comment",

//                             tooltip: "Comment",
//                             type: "Transparent",
//                             enabled:!dayObj.isWeekend,
//                             press: function (oEvent) {
//                                 // Example: open a Popover or Dialog to add a comment
//                                 const oButton = oEvent.getSource();
//                                 const oPopover = new sap.m.Popover({
//                                     title: "Add Note - " + dayObj.date,
//                                     placement: "Top",
//                                     content: new sap.m.TextArea({
//                                         width: "300px",
//                                         rows: 2,
//                                         placeholder: "Enter your comment..."
//                                     }),
//                                     endButton: new sap.m.Button({
//                                         icon: "sap-icon://decline",
//                                         press: function () {
//                                             oPopover.close();
//                                         }
//                                     }),
//                                     footer: new sap.m.Bar({
//                                         contentRight: [
//                                             new sap.m.Button({
//                                                 text: "Save",
//                                                 icon: "sap-icon://save",
//                                                 press: function () {
//                                                     oPopover.close();
//                                                 }
//                                             })
//                                         ]
//                                     })
//                                 });
//                                 oPopover.openBy(oButton);
//                             }
//                         })
//                     ],
//                     alignItems: "Center",
//                     justifyContent: "Start"
//                 });

//             };



//             // Template for each row
//             const oItemTemplate = new sap.m.ColumnListItem({
//                 cells: [
//                     new sap.m.ComboBox({
//                         width: "100px",
//                         items: {
//                             path: "/Projects",
//                             template: new sap.ui.core.Item({
//                                 key: "{projectName}",
//                                 text: "{projectName}"
//                             })
//                         }
//                     }),
//                     buildComboBoxCell("Activity", ["In Office", "Client location/Onsite", "Remote"])
//                 ].concat(
//                     aWeekDays.map(buildDayInputCell)
//                 ).concat([
//                     new sap.m.Text({ text: "{timesheet>Total}" })
//                 ])
//             });

//             // Initial row data
//             const oTimesheetData = [{
//                 Project: "",
//                 Activity: "",
//                 Total: 0
//             }];
//             aWeekDays.forEach(function (dayObj) {
//                 oTimesheetData[0][dayObj.date] = "";
//             });

//             // JSON model
//             const oTimesheetModel = new sap.ui.model.json.JSONModel(oTimesheetData);
//             this.getView().setModel(oTimesheetModel, "timesheet");

//             // Bind data
//             oTable.bindItems({
//                 path: "timesheet>/",
//                 template: oItemTemplate
//             });

//             const oAddButton = new sap.m.Button({
//                 text: "Add Row",
//                 icon: "sap-icon://add",
//                 press: function () {
//                     const oModel = that.getView().getModel("timesheet");
//                     const aData = oModel.getProperty("/");

//                     const oNewRow = {
//                         Project: "",
//                         Activity: "",
//                         Total: 0
//                     };
//                     aWeekDays.forEach(function (dayObj) {
//                         oNewRow[dayObj.date] = "";
//                     });

//                     aData.push(oNewRow);
//                     oModel.setProperty("/", aData);
//                 }
//             });

//             this.oDateIntravel = new sap.ui.unified.CalendarDateInterval({
//                 startDate: monday,
//                 width: "400px",
//                 select: function (oEvent) {
//                     var oSelectedDate = oEvent.getParameter("startDate");
//                     console.log("Selected date:", oSelectedDate);
//                 }
//             });

//             // 2. Create Popover and add Calendar to it
//             this.oPopover = new sap.m.Popover({
//                 title: "Select Date",
//                 contentWidth: "auto",
//                 contentHeight: "auto",
//                 placement: sap.m.PlacementType.Bottom,
//                 content: [this.oDateIntravel]
//             });

//             // 3. Create the Button
//             var oCalender = new sap.m.Button({
//                 icon: "sap-icon://calendar",
//                 press: function (oEvent) {
//                     this.oPopover.openBy(oEvent.getSource());
//                 }.bind(this)  // bind `this` so we can access oPopover
//             });


//             oTable.setHeaderToolbar(new sap.m.Toolbar({
//                 content: [
//                     new sap.m.Title({ text: "Weekly Timesheet", level: "H2" }),
//                     new sap.m.ToolbarSpacer(),
//                     oCalender,
//                     oAddButton,
//                     new sap.m.Button({
//                         text: "Save",
//                         type: "Emphasized",
//                         press: function () {
//                             var oView = this.getParent(); // gets the View from inside the toolbar

//                             var aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
//                             var aTableData = oView.getModel("timesheet").getProperty("/");

//                             var sEmployeeID = "d7375d5e-d862-4a56-9ccb-b823be63ab44";
//                             var sProjectID = "7d9da7f9-496e-42fc-a049-09d4b600c815";

//                             var aTimesheetPayload = [];

//                             aTableData.forEach(function (row) {
//                                 if (!row.Project || !row.Activity) return;

//                                 var aEntries = [];

//                                 aWeekDays.forEach(function (day) {
//                                     var sHours = row[day.date];
//                                     if (sHours && !isNaN(parseFloat(sHours))) {
//                                         aEntries.push({
//                                             workDate: day.date,
//                                             hoursWorked: parseFloat(sHours)
//                                         });
//                                     }
//                                 });

//                                 if (aEntries.length > 0) {
//                                     aTimesheetPayload.push({
//                                         employeeID: sEmployeeID,
//                                         projectID: sProjectID,
//                                         activity: row.Activity,
//                                         entries: aEntries
//                                     });
//                                 }
//                             });

//                             if (aTimesheetPayload.length === 0) {
//                                 sap.m.MessageToast.show("Please fill in valid timesheet data.");
//                                 return;
//                             }

//                             $.ajax({
//                                 url: "/odata/v4/timesheet/SubmitWeeklyTimeSheet",
//                                 method: "POST",
//                                 contentType: "application/json",
//                                 dataType: "json",
//                                 data: JSON.stringify({ data: aTimesheetPayload }),

//                                 success: function () {
//                                     sap.m.MessageToast.show("Timesheet submitted successfully!");
//                                     console.log("Timesheet payload sent:", aTimesheetPayload);
//                                 },

//                                 error: function (xhr, status, error) {
//                                     var errorMessage = "Failed to submit timesheet.";
//                                     try {
//                                         if (xhr.responseText) {
//                                             var errorResponse = JSON.parse(xhr.responseText);
//                                             if (errorResponse.error && errorResponse.error.message) {
//                                                 errorMessage = errorResponse.error.message;
//                                             } else if (errorResponse.message) {
//                                                 errorMessage = errorResponse.message;
//                                             }
//                                         }
//                                     } catch (e) {
//                                         console.error("Error parsing backend error response:", e);
//                                     }

//                                     sap.m.MessageToast.show(errorMessage);
//                                     console.error("AJAX Error:", status, error, xhr.responseText);
//                                 }
//                             });
//                         }
//                     })
//                 ]
//             }));


//             oSubSection.addBlock(oTable);



//         },

//         tableRefresh: function () {
//             var oTable = this.getView().byId("idTimeTable");
//             var oBinding = oTable.getBinding("items");

//             if (oBinding) {
//                 oBinding.refresh();
//             } else {
//                 console.warn("Table binding not found. Unable to refresh.");
//             }
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

    return Controller.extend("com.employee.employee.controller.Home", {
        onInit: function () {

               const oModel = this.getView().getModel();
            //    let oDatamodel=oModel.bindItems("/Projects");
               console.log(oModel);
            try {
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

                const oTable = new Table({ fixedLayout: false });

                ["Project", "Activity"].forEach(label => {
                    oTable.addColumn(new Column({ header: new Label({ text: label }) }));
                });

                aWeekDays.forEach(day => {
                    oTable.addColumn(new Column({
                        header: new Label({ text: day.day }),
                        styleClass: day.isWeekend ? "weekendColumn" : ""
                    }));
                });

                oTable.addColumn(new Column({ header: new Label({ text: "Total" }) }));

                // function buildComboBoxCell(fieldName, staticItems) {
                //     if (Array.isArray(staticItems)) {
                //         return new ComboBox({
                //             width: "100px",
                //             items: staticItems.map(item => new Item({ key: item, text: item }))
                //         });
                //     } else {
                //         return new ComboBox({
                //             //selectedKey: `{timesheet>${fieldName}}`,
                //             width: "100px",
                //             items: {
                //                 path: "/Projects",
                //                 template: new Item({ key: "{ID}", text: "{projectName}" })
                //             }
                //         });
                //     }
                // }

                function buildDayInputCell(dayObj) {
                    return new sap.m.HBox({
                        items: [
                            new Input({
                                value: `{timesheet>${dayObj.date}}`,
                                width: "50px",
                                editable: !dayObj.isWeekend,
                                valueState: dayObj.isWeekend ? "Warning" : "None",
                                valueStateText: dayObj.isWeekend ? "Weekend" : "",
                                change: function () {
                                    try {
                                        const oModel = that.getView().getModel("timesheet");
                                        const aData = oModel.getProperty("/");
                                        let total = 0;
                                        aWeekDays.forEach(day => {
                                            const value = aData[0][day.date];
                                            if (value && !isNaN(parseFloat(value))) {
                                                total += parseFloat(value);
                                            }
                                        });
                                        aData[0].Total = total;
                                        oModel.setProperty("/", aData);
                                    } catch (err) {
                                        MessageToast.show("Error calculating total: " + err.message);
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
                                        const oButton = oEvent.getSource();
                                        const oPopover = new Popover({
                                            title: `Add Note - ${dayObj.date}`,
                                            placement: "Top",
                                            content: new TextArea({
                                                width: "300px",
                                                rows: 2,
                                                placeholder: "Enter your comment..."
                                            }),
                                            endButton: new Button({
                                                icon: "sap-icon://decline",
                                                press: () => oPopover.close()
                                            }),
                                            footer: new Bar({
                                                contentRight: [
                                                    new Button({
                                                        text: "Save",
                                                        icon: "sap-icon://save",
                                                        press: () => oPopover.close()
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

                // const oItemTemplate = new ColumnListItem({
                //     cells: [
                //         new ComboBox({
                //             width: "100px",
                //             items: {
                //                 path: "/Projects",
                //                 template: new sap.ui.core.ListItem({ key: "{ID}", text: "{projectName}" })
                //             },
                //             firehange: function (oEvent) {
                //                 console.log(oEvent)
                //             }
                //         }),

                //         new ComboBox({
                //             width: "100px",
                //             items: [
                //                 new Item({ key: "In_Office", text: "In Office" }),
                //                 new Item({ key: "Remote", text: "Remote" }),
                //                 new Item({ key: "On_Leave", text: "On Leave" })
                //             ]
                //         }),
                //         //buildComboBoxCell("Activity", ["In Office", "Client location/Onsite", "Remote"]),
                //         ...aWeekDays.map(buildDayInputCell),
                //         new Text({ text: "{timesheet>Total}" })
                //     ]

                // });


                // First ComboBox - Project ComboBox
                const oProjectComboBox = new ComboBox({
                    width: "100px",
                    items: {
                        path: "mainService>/Projects",  // Use model name here
                        template: new sap.ui.core.ListItem({
                            key: "{mainService>ID}",     // Also prefix in template bindings
                            text: "{mainService>projectName}"
                        })
                    },
                    change: function (oEvent) {
                        console.log(oEvent);
                    }
                });

                console.log(oProjectComboBox)

                // Second ComboBox - Mode ComboBox
                const oModeComboBox = new ComboBox({
                    width: "100px",
                    items: [
                        new Item({ key: "In_Office", text: "In Office" }),
                        new Item({ key: "Remote", text: "Remote" }),
                        new Item({ key: "On_Leave", text: "On Leave" })
                    ]
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


                const oTimesheetData = [{ Project: "", Activity: "", Total: 0 }];
                aWeekDays.forEach(day => { oTimesheetData[0][day.date] = ""; });

                const oTimesheetModel = new JSONModel(oTimesheetData);
                this.getView().setModel(oTimesheetModel, "timesheet");

                oTable.bindItems({
                    path: "timesheet>/",
                    template: oItemTemplate
                });

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
                        } catch (err) {
                            MessageToast.show("Error adding row: " + err.message);
                            console.error(err);
                        }
                    }
                });

                this.oDateIntravel = new CalendarDateInterval({
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
                    content: [this.oDateIntravel]
                });

                const oCalendarButton = new Button({
                    icon: "sap-icon://calendar",
                    press: oEvent => this.oPopover.openBy(oEvent.getSource())
                });

                oTable.setHeaderToolbar(new Toolbar({
                    content: [
                        new Title({ text: "Weekly Timesheet", level: "H2" }),
                        new ToolbarSpacer(),
                        oCalendarButton,
                        oAddButton,
                        // new Button({
                        //     text: "Save",
                        //     type: "Emphasized",
                        //     press: function () {
                        //         try {
                        //             const oView = that.getView();
                        //             const aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
                        //             const aTableData = oView.getModel("timesheet").getProperty("/");

                        //             const sEmployeeID = "d7375d5e-d862-4a56-9ccb-b823be63ab44";
                        //             const sProjectID = "7d9da7f9-496e-42fc-a049-09d4b600c815";
                        //             const aTimesheetPayload = [];

                        //             aTableData.forEach(row => {
                        //                 if (!row.Project || !row.Activity) return;
                        //                 const aEntries = aWeekDays.reduce((entries, day) => {
                        //                     const hours = row[day.date];
                        //                     if (hours && !isNaN(parseFloat(hours))) {
                        //                         entries.push({ workDate: day.date, hoursWorked: parseFloat(hours) });
                        //                     }
                        //                     return entries;
                        //                 }, []);

                        //                 if (aEntries.length > 0) {
                        //                     aTimesheetPayload.push({
                        //                         employeeID: sEmployeeID,
                        //                         projectID: sProjectID,
                        //                         activity: row.Activity,
                        //                         entries: aEntries
                        //                     });
                        //                 }
                        //             });

                        //             if (aTimesheetPayload.length === 0) {
                        //                 MessageToast.show("Please fill in valid timesheet data.");
                        //                 return;
                        //             }

                        //             $.ajax({
                        //                 url: "/odata/v4/timesheet/SubmitWeeklyTimeSheet",
                        //                 method: "POST",
                        //                 contentType: "application/json",
                        //                 dataType: "json",
                        //                 data: JSON.stringify({ data: aTimesheetPayload }),
                        //                 success: () => MessageToast.show("Timesheet submitted successfully!"),
                        //                 error: function (xhr) {
                        //                     let errorMessage = "Failed to submit timesheet.";
                        //                     try {
                        //                         const response = JSON.parse(xhr.responseText);
                        //                         errorMessage = response.error?.message || response.message || errorMessage;
                        //                     } catch (e) {
                        //                         console.error("Error parsing backend error response:", e);
                        //                     }
                        //                     MessageToast.show(errorMessage);
                        //                 }
                        //             });
                        //         } catch (err) {
                        //             MessageToast.show("Unexpected error during save: " + err.message);
                        //             console.error(err);
                        //         }
                        //     }
                        // })
                    ]
                }));

                oSubSection.addBlock(oTable);
            } catch (err) {
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
