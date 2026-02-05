CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`firstname` text NOT NULL,
	`lastname` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`klaviyo_profile_id` text
);
