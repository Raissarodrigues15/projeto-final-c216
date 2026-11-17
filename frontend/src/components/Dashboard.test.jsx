import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
	it("deve calcular receitas, despesas e saldo", () => {
		const transactions = [
			{ type: "receita", amount: 3000 },
			{ type: "receita", amount: 500 },
			{ type: "despesa", amount: 1200 },
			{ type: "despesa", amount: 300 },
		];

		render(<Dashboard transactions={transactions} />);

		expect(screen.getByText("Saldo atual")).toBeInTheDocument();
		expect(screen.getByText("Total de receitas")).toBeInTheDocument();
		expect(screen.getByText("Total de despesas")).toBeInTheDocument();

		expect(screen.getByText("R$ 2.000,00")).toBeInTheDocument();
		expect(screen.getByText("R$ 3.500,00")).toBeInTheDocument();
		expect(screen.getByText("R$ 1.500,00")).toBeInTheDocument();
	});

	it("deve apresentar saldo negativo quando as despesas forem maiores", () => {
		const transactions = [
			{ type: "receita", amount: 1000 },
			{ type: "despesa", amount: 1500 },
		];

		render(<Dashboard transactions={transactions} />);

		expect(screen.getByText("-R$ 500,00")).toBeInTheDocument();
	});

	it("deve apresentar valores zerados sem transações", () => {
		render(<Dashboard transactions={[]} />);

		const zeroValues = screen.getAllByText("R$ 0,00");

		expect(zeroValues).toHaveLength(3);
	});
});
