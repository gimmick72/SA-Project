export type Patient = {
	id: number;
	firstname: string;
	lastname: string;
	phone_number: string;
};

// Minimal placeholder implementation; replace with real HTTP calls as needed
export const PatientAPI = {
	async getAll(): Promise<Patient[]> {
		return [];
	},
	async delete(_id: number): Promise<void> {
		return;
	},
}; 