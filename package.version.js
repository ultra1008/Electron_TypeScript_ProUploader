var svninfo = require('svn-info');
var versiony = require('versiony');

var info = svninfo.sync('.', 'HEAD');
console.log(info);
var revision = info.lastChangedRev;

versiony
  .from('package.json')     // read the version from package.json
//.patch()                  // will cause the patch/build version to be bumped by 1
  .preRelease(revision)     // will update the preRelease with svn revision 
  .to()                     // write the new version to the source file (package.json)
  .end()      
