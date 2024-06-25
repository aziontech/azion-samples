module.exports = {
  "rules": {
    "request": [
      {
        "name": "Main_Rule",
        "match": "^\\/",
        "runFunction": {
          "path": ".edge/worker.js"
        }
      }
    ]
  }
};