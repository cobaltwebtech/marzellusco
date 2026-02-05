import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { drizzle } from "drizzle-orm/d1";
import { customAlphabet } from "nanoid";
import { submissions } from "@/db/marketing-schema";

// Generate unique IDs using nanoid
const generateId = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	16,
);

// Validate form inputs with Zod
const marketingFormSchema = z.object({
	fullname: z.string().min(1, "Full name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	"confirm-policies": z
		.string()
		.refine(
			(val) => val === "on",
			"You must consent to providing your information",
		),
	"cf-turnstile-response": z
		.string()
		.min(1, "CAPTCHA verification is required"),
});

// Verify Cloudflare Turnstile token
async function verifyTurnstileToken(token: string): Promise<boolean> {
	const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;

	const formData = new FormData();
	formData.append("secret", secretKey);
	formData.append("response", token);

	try {
		const result = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				body: formData,
			},
		);

		const outcome = (await result.json()) as { success: boolean };
		return outcome.success;
	} catch (error) {
		console.error("Turnstile verification error:", error);
		return false;
	}
}

export const server = {
	// Action to handle Marketing Form submissions
	storeMarketingForm: defineAction({
		accept: "form",
		input: marketingFormSchema,
		handler: async (input, context) => {
			// Verify Turnstile token server-side
			const isValidToken = await verifyTurnstileToken(
				input["cf-turnstile-response"],
			);

			if (!isValidToken) {
				throw new ActionError({
					code: "UNAUTHORIZED",
					message: "CAPTCHA verification failed. Please try again.",
				});
			}

			// Initialize database connection
			const db = drizzle(context.locals.runtime.env.DB_MARKETING);

			// Insert form data into database
			try {
				await db.insert(submissions).values({
					id: generateId(),
					fullname: input.fullname,
					email: input.email,
					phone: input.phone,
				});
			} catch (error) {
				console.error("Database insertion error:", error);
				throw new ActionError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to store your submission. Please try again.",
				});
			}

			return {
				success: true,
			};
		},
	}),
};
