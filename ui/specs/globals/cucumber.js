import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import glob from 'glob'
import Cucumber from 'cucumber/lib/cucumber'

const CucumberSummaryFormatter = require('cucumber/lib/cucumber/listener/summary_formatter')({snippets: true})
const tempTestFolder = path.resolve(process.cwd(), 'specs/temp-tests')

const cucumber = {
    features: {}
}

function getFeatureSources() {
    return glob.sync("specs/features/**/*.feature").map((file) =>
        [path.resolve(process.cwd(), file), fs.readFileSync(file)])
}

function getSupportCodeInitializer() {
    return function () {
        const files = glob.sync("specs/step-definitions/**/*.js").map((file) => path.resolve(process.cwd(), file))

        files.forEach((file) => {
            const initializer = require(file)

            if (typeof initializer === 'function') {
                initializer.call(this)
            }
        })
    }
}

const runtime = Cucumber(getFeatureSources(), getSupportCodeInitializer())

function getStepExecutor(step) {
    const stepDefinition = runtime.getSupportCodeLibrary().lookupStepDefinitionByName(step.getName())

    if (!stepDefinition) {
        CucumberSummaryFormatter.storeUndefinedStepResult(step)
        CucumberSummaryFormatter.log(Cucumber.Util.ConsoleColor.format('pending', 'Undefined steps found!\n'))
        return
    }

    return (context, callback) => {
        stepDefinition.invoke(step, context, {
            getAttachments: () => {
            }
        }, {id: 1}, callback)
    }
}

function discoverScenario(feature, scenario, steps) {
    if (!feature.discovered) {
        feature.discovered = {}
        cucumber.features[feature.getName()] = feature.discovered
    }

    feature.discovered[scenario.getName()] = function (browser) {
        steps.forEach(function (step) {
            step(browser, function (result) {
                if (result.isFailed()) {
                    console.log(result.getFailureException())
                }
            })
        })
        browser.end()
    }
}

function createTestFile(feature) {
    const testFileSource = 'module.exports = require(process.cwd() + "/specs/globals/cucumber").features["' + feature.getName() + '"];'

    fs.writeFileSync(path.resolve(tempTestFolder, feature.getName().replace(/\W+/g, '') + '.js'), testFileSource)
}

rimraf.sync(tempTestFolder)
fs.mkdirSync(tempTestFolder)

runtime.getFeatures().getFeatures().forEach((feature, nextFeature) => {
    createTestFile(feature)
    feature.instructVisitorToVisitScenarios({
        visitScenario: function (scenario) {
            const steps = []
            scenario.getSteps().forEach((step, nextStep) => {
                const stepExecutor = getStepExecutor(step)

                if (stepExecutor) {
                    steps.push(stepExecutor)
                }
                nextStep()
            }, () => {
                discoverScenario(feature, scenario, steps)
            })
        }
    })
    nextFeature()
}, () => {
})

if (CucumberSummaryFormatter.getUndefinedStepLogBuffer()) {
    CucumberSummaryFormatter.logUndefinedStepSnippets()
}

export default cucumber
