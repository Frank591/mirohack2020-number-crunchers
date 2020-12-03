
async function calculateSelected() {
    iterationSelection({
            calculatedFromText: true,
            whiteList: ['Java', 'JavaScript']
        },
        {
            'STICKER': stickerProcessor,
            'CARD': cardProcessor
        }, function (calcResult) {
            console.log('Result: ', calcResult)
            showResults(calcResult)
        });
}

function showResults(results) {
    //clear()
    let title = results.unitOfMeasure + ' in selection';
    getContainer().appendChild(createStatTable(title, 'Looks like the selection is empty.', results))
}

function clear() {
    const elements = getContainer().getElementsByClassName('stat-list__table')
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
            `<span class="stat-list__item-name">${data.unitOfMeasure}(total amount)</span>` +
            `<span class="stat-list__item-value">${data.totalResult}</span>`
        statView.appendChild(totalView)


        for (var propertyName in data.groupedResult) {
            let itemView = document.createElement('div')
            itemView.className = 'stat-list__item'
            itemView.innerHTML =
                `<span class="stat-list__item-name">${data.unitOfMeasure}(${propertyName})</span>` +
                `<span class="stat-list__item-value">${data.groupedResult[propertyName]}</span>`
            statView.appendChild(itemView)
        }
    }
    return statView
}

miro.onReady(() => {
    calculateSelected()
})
