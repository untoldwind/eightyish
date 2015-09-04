export default function (library, browser, ctx) {
    library
        .given("I open Google's search page", function () {
            browser
                .url('http://google.com')
                .waitForElementVisible('body', 1000)
        })
        .then("the title is \"$TITLE\"", function (title) {
            browser.assert.title(title)
        })

        .then("the search form exists", function () {
            browser.assert.visible('input[name="q"]')
            ctx.takeScreenshot()
        })
}
