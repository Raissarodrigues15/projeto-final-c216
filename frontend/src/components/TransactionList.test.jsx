import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionList from "./TransactionList";

const categories = [{ id: 1, name: "Alimentação" }];

const transactions = [
	{
		id: 1,
		description: "Compra no mercado",
		amount: 150.5,
		type: "despesa",
		date: "2026-11-05",
		category_id: 1,
	},
];

describe("TransactionList", () => {
	it("deve exibir mensagem quando não existem transações", () => {
		render(
			<TransactionList
				transactions={[]}
				categories={categories}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
			/>,
		);

		expect(
			screen.getByText("Nenhuma transação cadastrada."),
		).toBeInTheDocument();
	});

	it("deve exibir os dados da transação", () => {
		render(
			<TransactionList
				transactions={transactions}
				categories={categories}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
			/>,
		);

		expect(screen.getByText("Compra no mercado")).toBeInTheDocument();
		expect(screen.getByText("Alimentação")).toBeInTheDocument();
		expect(screen.getByText("Despesa")).toBeInTheDocument();
		expect(screen.getByText(/150,50/)).toBeInTheDocument();
	});

	it("deve informar quando a categoria não for encontrada", () => {
		render(
			<TransactionList
				transactions={[{ ...transactions[0], category_id: 99 }]}
				categories={categories}
				onEdit={vi.fn()}
				onDelete={vi.fn()}
			/>,
		);

		expect(screen.getByText("Categoria não encontrada")).toBeInTheDocument();
	});

	it("deve chamar onEdit ao clicar em editar", () => {
		const onEdit = vi.fn();

		render(
			<TransactionList
				transactions={transactions}
				categories={categories}
				onEdit={onEdit}
				onDelete={vi.fn()}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Editar" }));

		expect(onEdit).toHaveBeenCalledWith(transactions[0]);
	});

	it("deve chamar onDelete ao clicar em excluir", () => {
		const onDelete = vi.fn();

		render(
			<TransactionList
				transactions={transactions}
				categories={categories}
				onEdit={vi.fn()}
				onDelete={onDelete}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Excluir" }));

		expect(onDelete).toHaveBeenCalledWith(1);
	});
});
