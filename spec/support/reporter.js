//const fs = require('fs');
const  JUnitXmlReporter  = require('jasmine-reporters');

const junitReporter = new JUnitXmlReporter.JUnitXmlReporter({
        savePath:'./',
        consolidateAll:false
});

jasmine.getEnv().addReporter(junitReporter);