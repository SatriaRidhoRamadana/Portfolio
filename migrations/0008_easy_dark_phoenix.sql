CREATE TABLE `education` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`degree` text NOT NULL,
	`school` text NOT NULL,
	`year_start` integer NOT NULL,
	`year_end` integer NOT NULL,
	`description` text
);
