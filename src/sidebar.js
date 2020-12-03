function showResults(results) {
    //clear()

    getContainer().appendChild(createStatTable('by Type', 'Looks like the selection is empty.', results))
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
        let totalView = document.createElement('div')
        totalView.className = 'stat-list__item'
        totalView.innerHTML =
            `<span class="stat-list__item-name">Total amount</span>` +
            `<span class="stat-list__item-value">${data.totalResult}</span>`
     /*   data.forEach((value, key) => {
            let itemView = document.createElement('div')
            itemView.className = 'stat-list__item'
            itemView.innerHTML =
                `<span class="stat-list__item-name">${key.toLowerCase()}</span>` +
                `<span class="stat-list__item-value">${value}</span>`
            statView.appendChild(itemView)
        })*/
    }
    return statView
}

