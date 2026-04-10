const patterns = {
	letters: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^\d{10}$/,
};

const mysqlPatterns = {
	duplicateEntryKey: /for key '[^.]+\.([^']+)'/,
};

module.exports = {
	patterns,
	mysqlPatterns,
};
