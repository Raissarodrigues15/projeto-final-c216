import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionForm from "./TransactionForm";

const categories = [{ id: 1, name: "Alimentação" }];

describe("TransactionForm", () => {
	it("deve exibir mensagem quando não existem categorias", () => {
		render(
			<TransactionForm
				categories={[]}
				onSubmit={vi.fn()}
				editingTransaction={null}
				onCancelEdit={vi.fn()}
			/>,
		);

		expect(
			screen.getByText(/Cadastre uma categoria antes/),
		).toBeInTheDocument();
	});

	it("deve cadastrar uma despesa", async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);

		render(
			<TransactionForm
				categories={categories}
				onSubmit={onSubmit}
				editingTransaction={null}
				onCancelEdit={vi.fn()}
			/>,
		);

		fireEvent.change(screen.getByPlaceholderText("Ex.: Conta de luz"), {
			target: { value: "Conta de energia" },
		});

		fireEvent.change(screen.getByPlaceholderText("0,00"), {
			target: { value: "150.50" },
		});

		fireEvent.change(screen.getByLabelText("Categoria"), {
			target: { value: "1" },
		});

		fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					description: "Conta de energia",
					amount: 150.5,
					type: "despesa",
					category_id: 1,
				}),
			);
		});
	});

	it("deve permitir cadastrar uma receita", async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);

		render(
			<TransactionForm
				categories={categories}
				onSubmit={onSubmit}
				editingTransaction={null}
				onCancelEdit={vi.fn()}
			/>,
		);

		fireEvent.change(screen.getByPlaceholderText("Ex.: Conta de luz"), {
			target: { value: "Salário" },
		});

		fireEvent.change(screen.getByPlaceholderText("0,00"), {
			target: { value: "3000" },
		});

		fireEvent.change(screen.getByLabelText("Tipo"), {
			target: { value: "receita" },
		});

		fireEvent.change(screen.getByLabelText("Categoria"), {
			target: { value: "1" },
		});

		fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					description: "Salário",
					amount: 3000,
					type: "receita",
					category_id: 1,
				}),
			);
		});
	});

	it("deve preencher o formulário ao editar uma transação", () => {
		const transaction = {
			id: 1,
			description: "Aluguel",
			amount: 1200,
			type: "despesa",
			date: "2026-11-05",
			category_id: 1,
		};

		render(
			<TransactionForm
				categories={categories}
				onSubmit={vi.fn()}
				editingTransaction={transaction}
				onCancelEdit={vi.fn()}
			/>,
		);

		expect(screen.getByDisplayValue("Aluguel")).toBeInTheDocument();
		expect(screen.getByDisplayValue("1200")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Salvar alterações" }),
		).toBeInTheDocument();
	});

	it("deve cancelar a edição", () => {
		const onCancelEdit = vi.fn();

		render(
			<TransactionForm
				categories={categories}
				onSubmit={vi.fn()}
				editingTransaction={{
					id: 1,
					description: "Aluguel",
					amount: 1200,
					type: "despesa",
					date: "2026-11-05",
					category_id: 1,
				}}
				onCancelEdit={onCancelEdit}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

		expect(onCancelEdit).toHaveBeenCalled();
	});
});
