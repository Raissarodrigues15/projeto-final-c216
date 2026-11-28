import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CategoryForm from "./CategoryForm";

describe("CategoryForm", () => {
	it("deve exibir as categorias cadastradas", () => {
		const categories = [
			{ id: 1, name: "Alimentação", description: "Gastos com comida" },
		];

		render(
			<CategoryForm
				categories={categories}
				onSubmit={vi.fn()}
				onDelete={vi.fn()}
			/>,
		);

		expect(screen.getByText("Alimentação")).toBeInTheDocument();
		expect(screen.getByText("Gastos com comida")).toBeInTheDocument();
	});

	it("deve cadastrar uma categoria", async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);

		render(
			<CategoryForm categories={[]} onSubmit={onSubmit} onDelete={vi.fn()} />,
		);

		fireEvent.change(screen.getByPlaceholderText("Nome da categoria"), {
			target: { value: "Transporte" },
		});

		fireEvent.change(screen.getAllByRole("textbox")[1], {
			target: { value: "Gastos com ônibus" },
		});

		fireEvent.click(
			screen.getByRole("button", { name: "Adicionar categoria" }),
		);

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith({
				name: "Transporte",
				description: "Gastos com ônibus",
			});
		});

		expect(screen.getByPlaceholderText("Nome da categoria")).toHaveValue("");
	});

	it("não deve cadastrar categoria com nome vazio", () => {
		const onSubmit = vi.fn();

		render(
			<CategoryForm categories={[]} onSubmit={onSubmit} onDelete={vi.fn()} />,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Adicionar categoria" }),
		);

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("deve solicitar a exclusão da categoria", () => {
		const onDelete = vi.fn();

		render(
			<CategoryForm
				categories={[{ id: 2, name: "Lazer", description: null }]}
				onSubmit={vi.fn()}
				onDelete={onDelete}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: "Excluir categoria Lazer" }),
		);

		expect(onDelete).toHaveBeenCalledWith(2);
	});
});
