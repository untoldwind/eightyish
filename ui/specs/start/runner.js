import fs from 'fs'
import Yadda from 'yadda'

const English = Yadda.localisation.English
const parser = new Yadda.parsers.FeatureParser()

const features = new Yadda.FeatureFileSearch('specs/features').list()
const steps = {}

const stepInitializers = new Yadda.FileSearch('specs/steps', /.*-steps\.js$/).list().
    map((file) => require(`../../${file}`))

const dictionary = new Yadda.Dictionary()

features.forEach((file) => {
    const text = fs.readFileSync(file, 'utf8')
    const feature = parser.parse(text)

    console.log(`\nFeature loading: "${feature.title}"`)

    feature.scenarios.forEach((scenario) => {
        console.log(` -  ${scenario.title}`)

        steps[`${feature.title}/${scenario.title}`] = (browser) => {
            let counter = 1
            const library = English.library(dictionary)
            const ctx = {
                browser: browser,
                feature: feature.title,
                scenario: scenario.title,
                takeScreenshot: () => {
                    browser.saveScreenshot(`specs/reports/screenshots/${feature.title}_${scenario.title}_${counter}.png`)
                    counter++
                }
            }
            stepInitializers.forEach((stepInitializer) => stepInitializer(library, ctx))
            const yadda = new Yadda.Yadda(library)
            yadda.yadda(scenario.steps, {browser: browser})
        }
    })

})

steps['Close Session'] = (browser) => {
    browser.end()
}

export default steps
