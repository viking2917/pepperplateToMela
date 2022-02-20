var fs = require('fs');

module.exports = {
parseFile: function(fileLoc) {
    parsedFieldsList = {}
    var contents = fs.readFileSync(fileLoc, 'utf8')
       var srch = contents.match(/([A-Z][a-zA-Z]+|Original URL):/g)
        srch.forEach(element => {
            var res = '';
            if(srch.length > srch.indexOf(element)+1)
                res = contents.substring(contents.indexOf(element) + element.length, contents.indexOf(srch[srch.indexOf(element)+1]));
            else 
                res = contents.substring(contents.indexOf(element) + element.length);
            parsedFieldsList[element.substring(0,element.length-1).toLowerCase()] = res.trim();
        });
        return JSON.stringify(parsedFieldsList);
    }
}