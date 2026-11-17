function formatCurrency(value) {
	return Number(value || 0).toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

export default function Dashboard({ transactions }) {
	const income = transactions
		.filter((item) => item.type === "receita")
		.reduce((total, item) => total + Number(item.amount), 0);

	const expenses = transactions
		.filter((item) => item.type === "despesa")
		.reduce((total, item) => total + Number(item.amount), 0);

	const balance = income - expenses;

	return (
		<section className="dashboard">
			<article className="summary-card balance-card">
				<span>Saldo atual</span>
				<strong>{formatCurrency(balance)}</strong>
			</article>

			<article className="summary-card income-card">
				<span>Total de receitas</span>
				<strong>{formatCurrency(income)}</strong>
			</article>

			<article className="summary-card expense-card">
				<span>Total de despesas</span>
				<strong>{formatCurrency(expenses)}</strong>
			</article>
		</section>
	);
}
