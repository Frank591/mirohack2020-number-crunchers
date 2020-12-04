miro.onReady(() => {
    const icon24 =
        '<rect x="3" y="3" width="42" height="42" rx="2" fill="#FFD02F"/>\n' +
        '<path d="M5 4H23C23.5523 4 24 4.44771 24 5V24H4V5C4 4.44772 4.44771 4 5 4Z" fill="#4262FF" stroke="#4666F6" stroke-width="2"/>\n' +
        '<path d="M41.532 23.304L41.504 25.628H36.044V31.06H33.72V25.628H28.288V23.304H33.748V17.9H36.072V23.304H41.532Z" fill="#050038"/>\n' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.16666 8.33333C8.70642 8.33333 8.33333 8.70643 8.33333 9.16667V9.16667C8.33333 9.6269 8.70642 10 9.16666 10H13V19C13 19.5523 13.4477 20 14 20H14.3333C14.8856 20 15.3333 19.5523 15.3333 19V10H18.8333C19.2936 10 19.6667 9.6269 19.6667 9.16667V9.16667C19.6667 8.70643 19.2936 8.33333 18.8333 8.33333H9.16666Z" fill="white"/>\n' +
        '<path d="M3 23H25V43C25 44.1046 24.1046 45 23 45H5C3.89543 45 3 44.1046 3 43V23Z" fill="#77CC66"/>\n' +
        '<path d="M11.5511 32.5196C12.086 32.5196 12.5196 32.086 12.5196 31.5511C12.5196 31.0162 12.086 30.5826 11.5511 30.5826C11.0162 30.5826 10.5826 31.0162 10.5826 31.5511C10.5826 32.086 11.0162 32.5196 11.5511 32.5196Z" fill="white"/>\n' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.29131 28C8.57814 28 8 28.5781 8 29.2913V33.5435C8 33.8859 8.13605 34.2144 8.37822 34.4565L13.5435 39.6218C14.0477 40.1261 14.8654 40.1261 15.3696 39.6218L19.6218 35.3696C20.1261 34.8654 20.1261 34.0477 19.6218 33.5435L14.4565 28.3782C14.2144 28.136 13.8859 28 13.5435 28H9.29131ZM9.29131 29.2913H13.5435L18.7087 34.4565L14.4565 38.7087L9.29131 33.5435V29.2913Z" fill="white"/>'

    miro.initialize({
        extensionPoints: {
            bottomBar: {
                title: 'Sp counter',
                svgIcon: icon24,
                onClick: async () => {
                    const authorized = await miro.isAuthorized()
                    if (authorized) {
                        miro.board.ui.openLeftSidebar('mirohack2020-number-crunchers/sidebar.html');
                    }
                    else {
                        miro.board.ui.openModal('/mirohack2020-number-crunchers/not-authorized.html').then((res) => {
                            if (res === 'success') {
                                calculateSelected()
                            }
                        })
                    }
                },
            },
        },
    })
})
