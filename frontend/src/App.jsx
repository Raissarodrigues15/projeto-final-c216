import { useCallback, useEffect, useState } from "react";
import CategoryForm from "./components/CategoryForm";
import Dashboard from "./components/Dashboard";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import { api } from "./services/api";
import "./App.css";

export default function App() {
	const [categories, setCategories] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [editingTransaction, setEditingTransaction] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const loadData = useCallback(async () => {
		setLoading(true);
		setError("");

		try {
			const [categoryData, transactionData] = await Promise.all([
				api.getCategories(),
				api.getTransactions(),
			]);

			setCategories(categoryData);
			setTransactions(transactionData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	async function handleCreateCategory(data) {
		try {
			await api.createCategory(data);
			setSuccess("Categoria cadastrada com sucesso!");
			await loadData();
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}

	async function handleDeleteCategory(id) {
		if (!window.confirm("Deseja realmente excluir esta categoria?")) return;

		try {
			await api.deleteCategory(id);
			setSuccess("Categoria excluída com sucesso!");
			await loadData();
		} catch (err) {
			setError(err.message);
		}
	}

	async function handleSaveTransaction(data) {
		try {
			if (editingTransaction) {
				await api.updateTransaction(editingTransaction.id, data);
				setSuccess("Transação atualizada com sucesso!");
				setEditingTransaction(null);
			} else {
				await api.createTransaction(data);
				setSuccess("Transação cadastrada com sucesso!");
			}

			await loadData();
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}

	async function handleDeleteTransaction(id) {
		if (!window.confirm("Deseja realmente excluir esta transação?")) return;

		try {
			await api.deleteTransaction(id);
			setSuccess("Transação excluída com sucesso!");
			await loadData();
		} catch (err) {
			setError(err.message);
		}
	}

	function handleEditTransaction(transaction) {
		setEditingTransaction(transaction);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<div className="app">
			<header className="app-header">
				<div>
					<span className="brand-label">CONTROLE FINANCEIRO</span>
					<h1>Meu Financeiro</h1>
					<p>Organize suas receitas e despesas em um só lugar.</p>
				</div>
			</header>

			<main className="main-content">
				{error && (
					<div className="message error-message">
						<span>{error}</span>
						<button type="button" onClick={() => setError("")}>
							Fechar
						</button>
					</div>
				)}

				{success && (
					<div className="message success-message">
						<span>{success}</span>
						<button type="button" onClick={() => setSuccess("")}>
							Fechar
						</button>
					</div>
				)}

				{loading ? (
					<p className="loading-message">Carregando informações...</p>
				) : (
					<>
						<Dashboard transactions={transactions} />

						<div className="content-grid">
							<div className="forms-column">
								<TransactionForm
									categories={categories}
									onSubmit={handleSaveTransaction}
									editingTransaction={editingTransaction}
									onCancelEdit={() => setEditingTransaction(null)}
								/>

								<CategoryForm
									categories={categories}
									onSubmit={handleCreateCategory}
									onDelete={handleDeleteCategory}
								/>
							</div>

							<div className="transactions-column">
								<TransactionList
									transactions={transactions}
									categories={categories}
									onEdit={handleEditTransaction}
									onDelete={handleDeleteTransaction}
								/>
							</div>
						</div>
					</>
				)}
			</main>

			<footer className="app-footer">
				Sistema de Gestão Financeira • Projeto C216
			</footer>
		</div>
	);
}
