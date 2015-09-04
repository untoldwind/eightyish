import fs from 'fs'
import Yadda from 'yadda'

const English = Yadda.localisation.English
const parser = new Yadda.parsers.FeatureParser()

const features = new Yadda.FeatureFileSearch('specs/features').list()
const steps = {}

const stepInitializers = new Yadda.FileSearch('specs/steps', /.*-steps\.js$/).list()
    .map((file) => require(`../../${file}`))

const dictionary = new Yadda.Dictionary()
    .define('num', /(0x[0-9A-F]+|\d+)/, Yadda.converters.integer)
    .define('onOff', /(on|off)/, (value, next) => next(null, value === 'on'))
    .define('assembler', /([^\u0000]*)/)

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
                feature: feature.title,
                scenario: scenario.title,
                takeScreenshot: () => {
                    browser.saveScreenshot(`specs/reports/screenshots/${feature.title}_${scenario.title}_${counter}.png`)
                    counter++
                }
            }
            stepInitializers.forEach((stepInitializer) => stepInitializer(library, browser, ctx))
            const yadda = new Yadda.Yadda(library)
            scenario.steps.forEach((step) => {
                browser.perform(() => {
                    console.log(`- ${step}`)
                })
                yadda.yadda([step], {browser: browser})
            })
            browser.end()
        }
    })
})

//steps['Close Session'] = (browser) => {
//    browser.end()
//}

export default steps
