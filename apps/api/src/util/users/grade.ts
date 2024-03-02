const JUNE = 5;

export function gradeToGradYear(grade: number): number {
	const currentYear = new Date().getFullYear();
	const distToGrad = 12 - grade;
	const currentMonth = new Date().getMonth();
	if (currentMonth >= JUNE) {
		return currentYear + distToGrad + 1;
	}
	return currentYear + distToGrad;
}

export function gradYearToGrade(gradYear: number): number {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	const distToGrad = gradYear - currentYear;
	if (currentMonth >= JUNE) {
		return 12 - distToGrad + 1;
	}
	return 12 - distToGrad;
}
