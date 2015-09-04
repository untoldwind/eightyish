import fs from 'fs'
import Yadda from 'yadda'
import libraryCreator from './libraryCreator'

const parser = new Yadda.parsers.FeatureParser()

export default function(featureFile, scenarioTitle) {
    const text = fs.readFileSync(featureFile, 'utf8')
    const feature = parser.parse(text)

    const scenario = feature.scenarios.find((s) => s.title === scenarioTitle)
    const annotations = Object.assign({}, feature.annotations, scenario.annotations)
    const tags = []
    let disabled = false

    Object.keys(annotations).forEach((key) => {
        if ( key === 'disabled') {
            disabled = true
        } else {
            tags.push(key)
        }
    })

    return {
        "@disabled": disabled,
        "@tags": tags,
        [scenarioTitle]: (browser) => {
            let counter = 1
            const ctx = {
                feature: feature.title,
                scenario: scenario.title,
                takeScreenshot: () => {
                    browser.saveScreenshot(`specs/reports/screenshots/${feature.title}_${scenario.title}_${counter}.png`)
                    counter++
                }
            }
            const library = libraryCreator(browser, ctx)
            const yadda = new Yadda.Yadda(library)
            scenario.steps.forEach((step) => {
                browser.perform(() => {
                    console.log(`- ${step}`)
                })
                yadda.yadda([step], {browser: browser})
            })
            browser.end()
        }
    }
}
