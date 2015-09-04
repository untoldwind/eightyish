import Yadda from 'yadda'
import dictionary from './dictionary'

const English = Yadda.localisation.English

const stepInitializers = new Yadda.FileSearch('specs/steps', /.*-steps\.js$/).list()
    .map((file) => require(`../../${file}`))

export default function(browser, ctx) {
    const library = English.library(dictionary)
    stepInitializers.forEach((stepInitializer) => stepInitializer(library, browser, ctx))

    return library
}
