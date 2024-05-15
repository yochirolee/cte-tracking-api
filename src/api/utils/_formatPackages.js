const formatPackages = (packages) => {
	const formmatedPackages = packages.map((package) => {
		return {
			hbl: package.hbl,
			containerId: package.containerId,
			invoiceId: package.invoiceId,
		};
	});
	return formmatedPackages;
};

module.exports = formatPackages;
