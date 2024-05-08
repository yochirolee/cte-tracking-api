const formatPackages = (packages, currentLocationId, statusId, updatedAt) => {
	const formmatedPackages = packages.map((package) => {
		return {
			hbl: package.hbl,
			currentLocationId: currentLocationId,
			statusId: statusId,
			updatedAt: updatedAt ? updatedAt : new Date(),
		};
	});
	return formmatedPackages;
};

module.exports = formatPackages;
