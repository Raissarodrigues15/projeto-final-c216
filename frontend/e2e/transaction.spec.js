import { expect, test } from "@playwright/test";

const apiUrl = "http://127.0.0.1:8000";

test("cadastra uma despesa e confirma sua persistência", async ({
        page,
        request,
}) => {
        const uniqueId = Date.now();
        const categoryName = `Categoria E2E ${uniqueId}`;
        const description = `Despesa E2E ${uniqueId}`;

        const categoryResponse = await request.post(`${apiUrl}/categories/`, {
                data: {
                        name: categoryName,
                        description: "Categoria criada pelo teste E2E",
                },
        });

        expect(categoryResponse.ok()).toBeTruthy();

        const category = await categoryResponse.json();

        await page.goto("/");

        await page.locator('input[name="description"]').fill(description);
        await page.locator('input[name="amount"]').fill("125.50");
        await page.locator('select[name="type"]').selectOption("despesa");
        await page.locator('input[name="date"]').fill("2026-11-17");
        await page
                .locator('select[name="category_id"]')
                .selectOption(String(category.id));

        await page.getByRole("button", { name: "Cadastrar" }).click();

        await expect(page.getByText(description, { exact: true })).toBeVisible();

        const transactionsResponse = await request.get(
                `${apiUrl}/transactions/`,
        );

        expect(transactionsResponse.ok()).toBeTruthy();

        const transactions = await transactionsResponse.json();

        expect(
                transactions.some(
                        (transaction) => transaction.description === description,
                ),
        ).toBeTruthy();
});
