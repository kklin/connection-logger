function IDChecker() {
  this.ids = {};
}

IDChecker.prototype.associate = function(host, id) {
  if (this.ids[host] === undefined) {
    this.ids[host] = new Set();
  }
  this.ids[host].add(id);
}

IDChecker.prototype.check = function() {
  console.log("Processing IDs:");
  console.log(this.ids);
  for (let host in this.ids) {
    const idSet = this.ids[host];
    if (idSet.size !== 1) {
      console.error(`FAILED multiple IDs for ${host}`);
    }
  }
}

module.exports = IDChecker;
