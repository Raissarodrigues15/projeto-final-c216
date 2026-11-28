import { useState } from "react";

export default function CategoryForm({ onSubmit, categories, onDelete }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	async function handleSubmit(event) {
		event.preventDefault();

		if (!name.trim()) return;

		await onSubmit({
			name: name.trim(),
			description: description.trim() || null,
		});

		setName("");
		setDescription("");
	}

	return (
		<section className="panel">
			<h2>Categorias</h2>

			<form className="category-form" onSubmit={handleSubmit}>
				<input
					value={name}
					onChange={(event) => setName(event.target.value)}
					placeholder="Nome da categoria"
					required
				/>

				<input
					value={description}
					onChange={(event) => setDescription(event.target.value)}
					placeholder="Descrição (opcional)"
				/>

				<button type="submit">Adicionar categoria</button>
			</form>

			<div className="category-list">
				{categories.map((category) => (
					<div className="category-item" key={category.id}>
						<span>
							<strong>{category.name}</strong>
							{category.description && <small>{category.description}</small>}
						</span>

						<button
							className="delete-button"
							type="button"
							onClick={() => onDelete(category.id)}
							aria-label={`Excluir categoria ${category.name}`}
						>
							Excluir
						</button>
					</div>
				))}

				{categories.length === 0 && (
					<p className="empty-message">Nenhuma categoria cadastrada.</p>
				)}
			</div>
		</section>
	);
}
