const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
	const response = await fetch(`${API_URL}${endpoint}`, {
		...options,
		headers: {
			...(options.body ? { "Content-Type": "application/json" } : {}),
			...options.headers,
		},
	});

	if (!response.ok) {
		let message = "Ocorreu um erro na comunicação com o servidor.";

		try {
			const data = await response.json();
			message = data.detail || message;
		} catch {
			// Mantém a mensagem padrão quando a resposta não contém JSON.
		}

		throw new Error(message);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}

export const api = {
	getCategories: () => request("/categories"),
	createCategory: (data) =>
		request("/categories", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

	getTransactions: () => request("/transactions"),
	createTransaction: (data) =>
		request("/transactions", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	updateTransaction: (id, data) =>
		request(`/transactions/${id}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),
	deleteTransaction: (id) =>
		request(`/transactions/${id}`, { method: "DELETE" }),
};
