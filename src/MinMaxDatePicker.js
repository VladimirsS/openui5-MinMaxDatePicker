sap.ui.define(["sap/m/DatePicker", "sap/m/MessageBox"], function(DatePicker, MessageBox) {
    "use strict";
    var MinMaxDatePicker = DatePicker.extend("custom.m.MinMaxDatePicker", {
        metadata: {
            library: "sap.m",
            properties: {
                minDate: {
                    type: "object",
                    group: "Data",
                    defaultValue: null
                },
                maxDate: {
                    type: "object",
                    group: "Data",
                    defaultValue: null
                }
            }
        },
        renderer: {}
    });

    (function() {
        MinMaxDatePicker.prototype.init = function() {
            DatePicker.prototype.init.apply(this, arguments);
        };

        MinMaxDatePicker.prototype.setMinDate = function(oDate) {
            if (jQuery.sap.equal(this._oMinDate, oDate)) {
                return this;
            }

            if (oDate && !(oDate instanceof Date)) {
                throw new Error("Date must be a JavaScript date object; " + this);
            }

            this._oMinDate = oDate;
            return this;
        };

        MinMaxDatePicker.prototype.setMaxDate = function(oDate) {
            if (jQuery.sap.equal(this._oMaxDate, oDate)) {
                return this;
            }

            if (oDate && !(oDate instanceof Date)) {
                throw new Error("Date must be a JavaScript date object; " + this);
            }

            this._oMaxDate = oDate;
            return this;
        };

        MinMaxDatePicker.prototype._selectDate = function(oEvent) {
            var aSelectedDates = this._oCalendar.getSelectedDates();
            var oDateOld = this.getDateValue();
            var oDate;
            var sValue = "";


            if (aSelectedDates.length > 0) {
                oDate = aSelectedDates[0].getStartDate();
            }

            // if date is not fitting to range roll back old selected date
            if (oDate && (oDate.getTime() < this._oMinDate.getTime() || oDate.getTime() > this._oMaxDate.getTime())) {
                this._oCalendar.removeAllSelectedDates();
                this._oCalendar.addSelectedDate(new sap.ui.unified.DateRange({
                    startDate: oDateOld
                }));
                return this;
            }

            this._oPopup.close();
            this._bFocusNoPopup = true;
            this.focus();

            // do not use this.onChange() because output pattern will change date (e.g. only last 2 number of year -> 1966 -> 2066 )
            if (!jQuery.sap.equal(oDate, oDateOld)) {
                this.setDateValue(oDate);
                // compare Dates because value can be the same if only 2 digits for year
                sValue = this.getValue();
                this.fireChangeEvent(sValue, {
                    valid: true
                });
                if (this.getDomRef()) { // as control could be destroyed during update binding
                    this._curpos = this._$input.val().length;
                    this._$input.cursorPos(this._curpos);
                }
            } else if (!this._bValid) {
                // wrong input before open calendar
                sValue = this._formatValue(oDate);
                if (sValue != this._$input.val()) {
                    this._bValid = true;
                    if (this.getDomRef()) { // as control could be destroyed during update binding
                        this._$input.val(sValue);
                    }
                    this.fireChangeEvent(sValue, {
                        valid: true
                    });
                }
            }
        };

    }());

    return MinMaxDatePicker;
}, /* bExport= */ true);