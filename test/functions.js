var locators = require('./constants').locators;

module.exports = {
    getElement: function (alias) {
        return document.querySelector(locators[alias]);
    } 
};