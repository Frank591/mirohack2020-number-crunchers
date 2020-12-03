async function calculateSelected(needDisplayOptions) {
    spSettingsStorage.get().then(async function (settings) {
        if (needDisplayOptions) {
            displayOptions(settings);
        }
        iterationSelection(settings,
            {
                'STICKER': stickerProcessor,
                'CARD': cardProcessor
            }, function (calcResult) {
                console.log('Result: ', calcResult)
                showResults(calcResult)
            });
    });
}

function displayOptions(settings) {
    var settingList = spSettingsStorage.getSettingList();
    for (var setting in settings) {
        var valueType = settingList[setting].type;
        var settingElement = document.getElementById(setting);
        switch (valueType) {
            case 'boolean':
                settingElement.checked = settings[setting];
                break;
            case 'string':
                settingElement.value = settings[setting];
                break;
            case 'list':
                settingElement.value = settings[setting].join();
                break;
            default:
                console.log('Unknown setting type ', valueType)
        }
    }
}

function saveOptions() {
    var newSettings = {};
    var settingList = spSettingsStorage.getSettingList();
    for (var setting in settingList) {
        var valueType = settingList[setting].type;
        var settingElement = document.getElementById(setting);
        var newValue = null;
        switch (valueType) {
            case 'boolean':
                newValue = settingElement.checked;
                break;
            case 'string':
                newValue = settingElement.value;
                break;
            case 'list':
                newValue = settingElement.value;
                if (newValue !== null && typeof newValue !== 'undefined') {
                    newValue = newValue.split(',');
                }
                break;
            default:
                console.log('Unknown setting type ', valueType)
        }
        if (newValue !== null && typeof newValue !== 'undefined' && '' + newValue !== "") {
            newSettings[setting] = newValue;
        } else {
            newSettings[setting] = null;
        }
    }
    spSettingsStorage.set(newSettings).then(function () {
        console.log('Settings were changed');
        calculateSelected(false);
    });
}

function showResults(results) {
    //clear()
    let title = results.unitOfMeasure + ' in selection';
    clearResults();
    getContainer().appendChild(createStatTable(title, 'Looks like the selection is empty.', results))
}

function clearResults() {
    const elements = getContainer().getElementsByClassName('stat-list__table')
    if (elements == null) {
        return;
    }
    for (let i = 0; i < elements.length; i++) {
        elements.item(i).remove()
    }
}

function getContainer() {
    return document.getElementById('stat-container')
}

function createStatTable(title, emptyText, data) {
    const statView = document.createElement('div')
    statView.className = 'stat-list__table'

    const titleView = document.createElement('div')
    titleView.className = 'stat-list__title'
    titleView.innerHTML = `<span>${title}</span>`
    statView.appendChild(titleView)

    if (data.totalResult === 0) {
        const emptyView = document.createElement('div')
        emptyView.className = 'stat-list__empty'
        emptyView.innerText = emptyText
        statView.appendChild(emptyView)
    } else {
        let totalValuableWidgetsView = document.createElement('div')
        totalValuableWidgetsView.className = 'stat-list__item'
        totalValuableWidgetsView.innerHTML =
            `<span class="stat-list__item-name">Valuable widgets count</span>` +
            `<span class="stat-list__item-value">${data.processedWidgets}</span>`
        statView.appendChild(totalValuableWidgetsView)

        let totalView = document.createElement('div')
        totalView.className = 'stat-list__item'
        totalView.innerHTML =
            `<span class="stat-list__item-name">total amount</span>` +
            `<span class="stat-list__item-value">${data.totalResult}&nbsp;${data.unitOfMeasure}</span>`
        statView.appendChild(totalView)

        for (var propertyName in data.groupedResult) {
            let itemView = document.createElement('div')
            itemView.className = 'stat-list__item'
            itemView.innerHTML =
                `<span class="stat-list__item-name">${propertyName}</span>` +
                `<span class="stat-list__item-value">${data.groupedResult[propertyName]}&nbsp;${data.unitOfMeasure}</span>`
            statView.appendChild(itemView)
        }
    }
    return statView
}

miro.onReady(() => {
    calculateSelected(true)

    miro.addListener('SELECTION_UPDATED', selection => {
        if (selection.data.length > 0) {
            calculateSelected(false)
        }
    })
})
