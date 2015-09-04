export default function (library, browser, ctx) {
    library
        .given('Navigate to machine view', () => {
            browser
                .resizeWindow(1200, 800)
                .url('http://localhost:8080/index.html')
                .waitForElementVisible('#btn-reset', 5000)
        })
        .when('$name button is clicked', (name) => {
            browser.click(`#btn-${name.toLowerCase()}`)
        })
        .then('Register $register is $num', (register, value) => {
            browser.expect.element(`#register-${register}-dec`).text.to.equal(value).before(500)
            browser.expect.element(`#register-${register}-hex`).text.to.equal(value).before(500)
        })
        .when('Video is toggled', () => {
            browser.click('#switch-video')
        })
        .then('Video should be toggled $onOff', (onOff) => {
            const expectedClass = onOff ? 'bootstrap-switch-on' : 'bootstrap-switch-off'
            browser.expect.element('#switch-video').to.have.attribute('class').which.contain(expectedClass).before(1000)
            if (onOff) {
                browser.expect.element('#video-memory-display').to.be.visible.before(500)
            } else {
                browser.expect.element('#video-memory-display').to.be.not.present.before(500)
            }
        })
}
