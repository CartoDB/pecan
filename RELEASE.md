1. Ensure proper version in package.json
1. Ensure CHANGELOG.md section exists for the new version, review it, add release date, and add stub for next version
1. Commit package.json, CHANGELOG.md
1. `git tag -a Major.Minor.Patch` to create a tag for the new version, use CHANGELOG.md section as tag content
1. `git push` to push new commit
1. `git push origin x.y.z` to push new tag, where x.y.z is the new version
1. `npm publish` to publish to NPM registry (make sure you have privileges)

This project adheres to [Semantic Versioning](http://semver.org/)
