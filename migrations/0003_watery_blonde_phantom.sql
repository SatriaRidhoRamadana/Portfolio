PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_contact_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`read` integer DEFAULT 0,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
INSERT INTO `__new_contact_messages`("id", "name", "email", "subject", "message", "read", "created_at") SELECT "id", "name", "email", "subject", "message", "read", "created_at" FROM `contact_messages`;--> statement-breakpoint
DROP TABLE `contact_messages`;--> statement-breakpoint
ALTER TABLE `__new_contact_messages` RENAME TO `contact_messages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;