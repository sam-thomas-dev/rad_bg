// handles logic and database functions based on input provided by controller, sends result to controller

const Location = require("../tools/location.js")

const mockDB = [new Location(1, "Brisbane", "Australia", "Queensland", 2, "mSv"),
  new Location(2, "Melbourne", "Australia", "Victoria", 4, "mSv"),
  new Location(3, "Perth", "Australia", "Western Australia", 6, "mSv"),
  new Location(4, "Sydney", "Australia", "New South Wales", 10, "mSv")
];

/**
 * Finds item in DB with id specified
 * @param {number} id id of return item
 * @returns {Location} location object representing item
 */
const getLocationByID = (id) => mockDB.find(item => item.id == id);

/**
 * Finds items in DB containing substring specified, returning a max of 8 items
 * @param {string} subString items returned contain this substring
 * @returns {Array} Array of Location objects
 */
const getLocationsBySubString = (subString) => {
  subString = subString.toLocaleLowerCase();
  return mockDB.filter(item => (
    item.name.toLocaleLowerCase().includes(subString)
    || item.country.toLocaleLowerCase().includes(subString)
    || item.subNational.toLocaleLowerCase().includes(subString)
  )); 
}

module.exports = {
  getLocationByID,
  getLocationsBySubString
};
