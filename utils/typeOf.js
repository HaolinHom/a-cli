/**
 * @param {*} arg
 * @return {string}
 * */
function typeOf(arg) {
	return Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
}

module.exports = typeOf;