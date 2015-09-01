describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.get('http://localhost:8080/index.html')

        browser.wait(function() {
            return element(by.id('btn-reset')).isPresent()
        }, 5000)
    })
})
