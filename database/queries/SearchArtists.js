const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * { all: [artists], count: count, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
	//Write a query that will follow sort, offset, limit options only
	console.log(criteria.name.length);
	const nameQ = criteria.name.length === 0 ? "": criteria.name;
	const maxAge = criteria.age ? criteria.age.max : 200;
	const minAge = criteria.age ? criteria.age.min : 0;
	const maxYearsActive = criteria.yearsActive ? criteria.yearsActive.max : 100;
	const minYearsActive = criteria.yearsActive ? criteria.yearsActive.min : 0;

	const query = Artist
		.find({ name: nameQ,
						age: { $lte: maxAge , $gte: minAge },
						yearsActive: { $lte: maxYearsActive, $gte: minYearsActive} })
		.sort({[sortProperty]: 1})
		.skip(offset)
		.limit(limit);

	return Promise.all([query, Artist.count()])
		.then((results) => {
			return { all: results[0], count: results[1], offset: offset, limit: limit };
		});
};
