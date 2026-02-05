import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { drizzle } from "drizzle-orm/d1";
import {
	ApiKeySession,
	ListEnum,
	ProfileEnum,
	ProfileSubscriptionBulkCreateJobEnum,
	ProfilesApi,
} from "klaviyo-api";
import { customAlphabet } from "nanoid";
import { submissions } from "@/db/marketing-schema";

// Generate unique IDs using nanoid
const generateId = customAlphabet(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	16,
);

/**
 * Formats a phone number to E.164 format for Klaviyo
 * Handles North American numbers: (123) 456-7890, 123-456-7890, 1234567890, etc.
 * Returns the formatted number or null if invalid
 */
function formatPhoneToE164(phone: string | undefined): string | null {
	if (!phone) return null;

	// Strip all non-digit characters
	const digits = phone.replace(/\D/g, "");

	// Handle 10-digit numbers (add +1 country code)
	if (digits.length === 10) {
		return `+1${digits}`;
	}

	// Handle 11-digit numbers starting with 1 (US/Canada country code)
	if (digits.length === 11 && digits.startsWith("1")) {
		return `+${digits}`;
	}

	// Invalid phone number length for North America
	return null;
}

// Validate form inputs with Zod
const marketingFormSchema = z.object({
	firstname: z.string().min(1, "First name is required"),
	lastname: z.string().min(1, "Last name is required"),
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

			// Format phone to E.164 format for Klaviyo and database storage
			const formattedPhone = formatPhoneToE164(input.phone);

			// Submit to Klaviyo first to get the profile ID
			let klaviyoProfileId: string | null = null;

			try {
				const session = new ApiKeySession(import.meta.env.KLAVIYO_API_KEY);
				const profilesApi = new ProfilesApi(session);

				// Create or update profile with all fields (firstName, lastName, etc.)
				// This returns the profile data including the Klaviyo profile ID
				const profileResponse = await profilesApi.createOrUpdateProfile({
					data: {
						type: ProfileEnum.Profile,
						attributes: {
							email: input.email,
							firstName: input.firstname,
							lastName: input.lastname,
							...(formattedPhone && { phoneNumber: formattedPhone }),
						},
					},
				});

				// Extract Klaviyo profile ID from response
				klaviyoProfileId = profileResponse.body.data.id ?? null;

				// Build subscriptions object - always include email, add SMS if valid phone provided
				const subscriptions = {
					email: {
						marketing: {
							consent: "SUBSCRIBED" as const,
						},
					},
					...(formattedPhone && {
						sms: {
							marketing: {
								consent: "SUBSCRIBED" as const,
							},
						},
					}),
				};

				// Subscribe profile to marketing channels and add to list "RDWzRd"
				await profilesApi.bulkSubscribeProfiles({
					data: {
						type: ProfileSubscriptionBulkCreateJobEnum.ProfileSubscriptionBulkCreateJob,
						attributes: {
							profiles: {
								data: [
									{
										type: ProfileEnum.Profile,
										attributes: {
											email: input.email,
											...(formattedPhone && { phoneNumber: formattedPhone }),
											subscriptions,
										},
									},
								],
							},
						},
						relationships: {
							list: {
								data: {
									type: ListEnum.List,
									id: "RDWzRd",
								},
							},
						},
					},
				});
			} catch (error) {
				console.error("Klaviyo submission error:", error);
				// Continue with D1 insert even if Klaviyo fails
			}

			// Insert form data into database (with Klaviyo profile ID if available)
			try {
				await db.insert(submissions).values({
					id: generateId(),
					firstname: input.firstname,
					lastname: input.lastname,
					email: input.email,
					phone: formattedPhone,
					klaviyoProfileId,
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
				klaviyoProfileId,
			};
		},
	}),
};
