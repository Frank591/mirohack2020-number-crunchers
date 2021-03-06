(function () {

    function defValue(rawValue, defaultValue) {
        return typeof rawValue === 'undefined' ? defaultValue : rawValue;
    }

    var defaultSettings = {
        calculatedFromText: true,
        unitOfMeasure: 'SP'
    }

    var settingList = {
        calculatedFromText: {
            type: 'boolean',
            title: 'Get number value from widget text'
        },
        whiteList: {
            type: 'list',
            title: 'List of enabled non-numeric tags'
        },
        regExp: {
            type: 'string',
            title: 'Regular expression for numeric values'
        },
        unitOfMeasure: {
            type: 'string',
            title: 'Name of unit of measure for numeric values'
        },
        distributedAmounts: {
            type: 'boolean',
            title: 'Distribute amounts for tags in single widget'
        }
    };

    var settingsPrefix = 'spCalcPluginSettings.';

    function SettingsStorage() {
    }

    SettingsStorage.prototype.get = async function () {
        var settings = {};
        var boardInfo = await miro.board.info.get();
        for (var setting in defaultSettings) {
            settings[setting] = defaultSettings[setting];
        }
        for (var setting in settingList) {
            var storedSettingValue = localStorage.getItem(this._getSettingName(boardInfo, setting));
            if (typeof storedSettingValue !== 'undefined' && storedSettingValue !== null) {
                settings[setting] = this._getConvertedValue(storedSettingValue, settingList[setting]);
            }
        }
        return settings;
    };

    SettingsStorage.prototype.set = async function(settings) {
        var boardInfo = await miro.board.info.get();
        for (var setting in settings) {
            var savingValue = this._getSavingValue(setting, settings[setting]);
            var settingName = this._getSettingName(boardInfo, setting);
            if (savingValue === null || typeof savingValue === 'undefined') {
                localStorage.removeItem(settingName);
            } else {
                localStorage.setItem(settingName, savingValue);
            }
        }
    };

    SettingsStorage.prototype.getSettingList = function () {
        return settingList;
    };

    SettingsStorage.prototype._getConvertedValue = function(rawValue, settingParam) {
        var valueType = defValue(settingParam, {}).type;
        switch (valueType) {
            case 'boolean':
                return 'true' === rawValue.toLowerCase();
            case 'string':
                return rawValue;
            case 'list':
                return this._getArrayFromString(rawValue);
            default:
                console.log('Unknown type', valueType);
        }
    };

    SettingsStorage.prototype._getArrayFromString = function(text) {
        if (defValue(text, null) === null) {
            return null;
        }
        var rawList = text.split(',');
        var finalList = [];
        for (var itemNo in rawList) {
            var rawItem = rawList[itemNo];
            if (defValue(rawItem, null) !== null) {
                finalList.push(rawItem.trim());
            }
        }
        return finalList;
    };

    SettingsStorage.prototype._getSavingValue = function(setting, settingValue) {
        var settingParam = settingList[setting];
        var valueType = defValue(settingParam, {}).type;
        switch (valueType) {
            case 'boolean':
                return '' + defValue(settingValue, false);
            case 'string':
                return settingValue;
            case 'list':
                return settingValue === null ? null : settingValue.join();
            default:
                console.log('Unknown type', valueType);
        }
    };

    SettingsStorage.prototype._getSettingName = function(boardInfo, setting) {
        return settingsPrefix + boardInfo.id + '.' + setting;
    }

    window.spSettingsStorage = new SettingsStorage();
})();

// Example of settings reading
// window.spSettingsStorage.get().then(function(settings) {console.log(settings);});

// Example of settings saving
// window.spSettingsStorage.set({calculatedFromText: false} ).then(function() {console.log('Was set');});

// Example of getting setting list
// window.spSettingsStorage.getSettingList();