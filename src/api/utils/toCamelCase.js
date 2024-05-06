function toCamelCase(sentence) {
	// Split the sentence into words by spaces
	if (!sentence) return "";
	const words = sentence.split(" ");

	// Capitalize the first letter of each word and lowercase the rest
	const camelCaseWords = words.map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	});

	// Join the words to retain spaces
	return camelCaseWords.join(" ");
}

module.exports = toCamelCase;
