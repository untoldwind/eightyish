import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'
import Yadda from 'yadda'

const parser = new Yadda.parsers.FeatureParser()

const features = new Yadda.FeatureFileSearch('specs/features').list()

const tempTestFolder = 'specs/temp-runners'

rimraf.sync(tempTestFolder)
fs.mkdirSync(tempTestFolder)

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match) => {
        if (+match === 0) {
            return "";
        }
        return match.toUpperCase()
    });
}
function createRunner(featureFile, feature, scenario) {
    const pathName = path.resolve(tempTestFolder, camelize(feature.title))

    if (!fs.existsSync(pathName)){
        fs.mkdirSync(pathName)
    }

    const fileName = path.resolve(pathName, camelize(scenario.title) + '.js')
    const content = `
import scenarioConvert from '../../globals/scenarioConvert'

export default scenarioConvert('${featureFile}', '${scenario.title}')
    `

    fs.writeFileSync(fileName, content)
}

features.forEach((file) => {
    const text = fs.readFileSync(file, 'utf8')
    const feature = parser.parse(text)

    feature.scenarios.forEach((scenario) => {
        createRunner(file, feature, scenario)
    })
})

