'use strict';

module.exports.inject = function(lodash) {
  return class User {
    constructor(name, birthYear) {
      this.name = name;
      this.birthYear = birthYear;
      this.age = (2015 - this.birthYear);
    }

    // static function
    static shoutSomething(message) {
      return lodash.capitalize(message);
    }

    // argumentless getter
    get ageNextYear() {
      return this.age + 1;
    }

    // method on objects
    ageInTheYearN(year) {
      return year - this.birthYear;
    }
  }
};
