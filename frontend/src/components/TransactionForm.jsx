import { useEffect, useState } from "react";

const initialForm = {
	description: "",
	amount: "",
	type: "despesa",
	date: new Date().toISOString().slice(0, 10),
	category_id: "",
};

export default function TransactionForm({
	categories,
	onSubmit,
	editingTransaction,
	onCancelEdit,
}) {
	const [form, setForm] = useState(initialForm);

	useEffect(() => {
		if (editingTransaction) {
			setForm({
				description: editingTransaction.description,
				amount: String(editingTransaction.amount),
				type: editingTransaction.type,
				date: editingTransaction.date.slice(0, 10),
				category_id: String(editingTransaction.category_id),
			});
		} else {
			setForm(initialForm);
		}
	}, [editingTransaction]);

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	}

	async function handleSubmit(event) {
		event.preventDefault();

		await onSubmit({
			description: form.description.trim(),
			amount: Number(form.amount),
			type: form.type,
			date: form.date,
			category_id: Number(form.category_id),
		});

		setForm(initialForm);
	}

	return (
		<section className="panel">
			<h2>{editingTransaction ? "Editar transação" : "Nova transação"}</h2>

			{categories.length === 0 ? (
				<p className="empty-message">
					Cadastre uma categoria antes de adicionar uma transação.
				</p>
			) : (
				<form className="transaction-form" onSubmit={handleSubmit}>
					<label>
						Descrição
						<input
							name="description"
							value={form.description}
							onChange={handleChange}
							placeholder="Ex.: Conta de luz"
							required
						/>
					</label>

					<label>
						Valor (R$)
						<input
							name="amount"
							type="number"
							min="0.01"
							step="0.01"
							value={form.amount}
							onChange={handleChange}
							placeholder="0,00"
							required
						/>
					</label>

					<label>
						Tipo
						<select name="type" value={form.type} onChange={handleChange}>
							<option value="despesa">Despesa</option>
							<option value="receita">Receita</option>
						</select>
					</label>

					<label>
						Data
						<input
							name="date"
							type="date"
							value={form.date}
							onChange={handleChange}
							required
						/>
					</label>

					<label>
						Categoria
						<select
							name="category_id"
							value={form.category_id}
							onChange={handleChange}
							required
						>
							<option value="">Selecione uma categoria</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
					</label>

					<div className="form-actions">
						<button type="submit">
							{editingTransaction ? "Salvar alterações" : "Cadastrar"}
						</button>

						{editingTransaction && (
							<button
								className="secondary-button"
								type="button"
								onClick={onCancelEdit}
							>
								Cancelar
							</button>
						)}
					</div>
				</form>
			)}
		</section>
	);
}
