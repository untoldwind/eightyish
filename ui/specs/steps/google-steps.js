export default function (library, ctx) {
    library
        .given("I open Google's search page", function () {
            ctx.browser
                .url('http://google.com')
                .waitForElementVisible('body', 1000)
        })
        .then("the title is \"$TITLE\"", function (title) {
            ctx.browser.assert.title(title)
        })

        .then("the search form exists", function () {
            ctx.browser.assert.visible('input[name="q"]')
            ctx.takeScreenshot()
        })
}
