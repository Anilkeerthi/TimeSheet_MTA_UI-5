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

                console.log(oProjectComboBox)

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
                        new Button({
                            text: "Save",
                            type: "Emphasized",
                            // press: function () {
                            //     try {
                            //         const oView = that.getView();
                            //         const aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
                            //         const aTableData = oView.getModel("timesheet").getProperty("/");

                            //         const sEmployeeID = "12d9eaf7-10e5-4ad0-a98a-37504f42a7e5";
                            //         const sProjectID = "13c447e9-bed3-4ec7-8654-2c9909f8d005";
                            //         const aTimesheetPayload = [];

                            //         aTableData.forEach(row => {
                            //             if (!row.Project || !row.Activity) return;
                            //             const aEntries = aWeekDays.reduce((entries, day) => {
                            //                 const hours = row[day.date];
                            //                 if (hours && !isNaN(parseFloat(hours))) {
                            //                     entries.push({ workDate: day.date, hoursWorked: parseFloat(hours) });
                            //                 }
                            //                 return entries;
                            //             }, []);

                            //             if (aEntries.length > 0) {
                            //                 aTimesheetPayload.push({
                            //                     employeeID: sEmployeeID,
                            //                     projectID: sProjectID,
                            //                     activity: row.Activity,
                            //                     entries: aEntries
                            //                 });
                            //             }
                            //         });

                            //         if (aTimesheetPayload.length === 0) {
                            //             MessageToast.show("Please fill in valid timesheet data.");
                            //             return;
                            //         }

                            //         $.ajax({
                            //             url: "/odata/v4/timesheet/SubmitWeeklyTimeSheet",
                            //             method: "POST",
                            //             contentType: "application/json",
                            //             dataType: "json",
                            //             data: JSON.stringify({ data: aTimesheetPayload }),
                            //             success: () => MessageToast.show("Timesheet submitted successfully!"),
                            //             error: function (xhr) {
                            //                 let errorMessage = "Failed to submit timesheet.";
                            //                 try {
                            //                     const response = JSON.parse(xhr.responseText);
                            //                     errorMessage = response.error?.message || response.message || errorMessage;
                            //                 } catch (e) {
                            //                     console.error("Error parsing backend error response:", e);
                            //                 }
                            //                 MessageToast.show(errorMessage);
                            //             }
                            //         });
                            //     } catch (err) {
                            //         MessageToast.show("Unexpected error during save: " + err.message);
                            //         console.error(err);
                            //     }
                            // }
                            press: function () {
                                try {
                                    const oView = that.getView(); // use 'this' instead of 'that' if context is correct
                                    const aWeekDays = sap.ui.getCore().getModel("weekModel").getProperty("/week");
                                    const aTableData = oView.getModel("timesheet").getProperty("/");

                                    const sEmployeeID = "12d9eaf7-10e5-4ad0-a98a-37504f42a7e5";
                                    const sProjectID = "13c447e9-bed3-4ec7-8654-2c9909f8d005";
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
                                                    comments: comment // Optional: add comment per row
                                                });
                                            }
                                            return entries;
                                        }, []);

                                        if (aEntries.length > 0) {
                                            aTimesheetPayload.push({
                                                employeeID: sEmployeeID,
                                                projectID: sProjectID,
                                                activity: row.Activity,
                                                entries: aEntries
                                            });
                                        }
                                    });

                                    if (aTimesheetPayload.length === 0) {
                                        MessageToast.show("Please fill in valid timesheet data.");
                                        return;
                                    }

                                    // Fire AJAX call to CAP OData action
                                    $.ajax({
                                        url: "/odata/v4/timesheet/SubmitWeeklyTimeSheet",
                                        method: "POST",
                                        contentType: "application/json",
                                        dataType: "json",
                                        data: JSON.stringify({ data: aTimesheetPayload }),
                                        success: () => {
                                            MessageToast.show("Timesheet submitted successfully!");
                                        },
                                        error: function (xhr) {
                                            let errorMessage = "Failed to submit timesheet.";
                                            try {
                                                const response = JSON.parse(xhr.responseText);
                                                errorMessage = response?.error?.message || response?.message || errorMessage;
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

                        })
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
