function formatCurrency(value) {
	return Number(value || 0).toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

function formatDate(value) {
	return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("pt-BR");
}

export default function TransactionList({
	transactions,
	categories,
	onEdit,
	onDelete,
}) {
	function getCategoryName(categoryId) {
		return (
			categories.find((category) => category.id === categoryId)?.name ||
			"Categoria não encontrada"
		);
	}

	return (
		<section className="panel">
			<h2>Transações</h2>

			{transactions.length === 0 ? (
				<p className="empty-message">Nenhuma transação cadastrada.</p>
			) : (
				<div className="table-wrapper">
					<table>
						<thead>
							<tr>
								<th>Descrição</th>
								<th>Categoria</th>
								<th>Data</th>
								<th>Tipo</th>
								<th>Valor</th>
								<th>Ações</th>
							</tr>
						</thead>

						<tbody>
							{transactions.map((transaction) => (
								<tr key={transaction.id}>
									<td>{transaction.description}</td>
									<td>{getCategoryName(transaction.category_id)}</td>
									<td>{formatDate(transaction.date)}</td>
									<td>
										<span className={`type-tag ${transaction.type}`}>
											{transaction.type === "receita" ? "Receita" : "Despesa"}
										</span>
									</td>
									<td>{formatCurrency(transaction.amount)}</td>
									<td className="actions-cell">
										<button
											className="secondary-button"
											type="button"
											onClick={() => onEdit(transaction)}
										>
											Editar
										</button>
										<button
											className="delete-button"
											type="button"
											onClick={() => onDelete(transaction.id)}
										>
											Excluir
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
}
