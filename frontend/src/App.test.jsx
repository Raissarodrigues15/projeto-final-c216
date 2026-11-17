import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Aplicação", () => {
	it("deve renderizar a aplicação", () => {
		render(<App />);

		expect(document.body.firstChild).toBeInTheDocument();
	});
});
