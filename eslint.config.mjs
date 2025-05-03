import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			"no-unused-vars": "warn",
			camelcase: "off",
			"id-length": "off",
			"spellcheck/spell-checker": [
				"warn",
				{
					words: ["placehold"],
				},
			],
		},
	},
];

/** @type {import("eslint").Linter.Config} */
const config = {
	extends: ["next/core-web-vitals"],
	rules: {
		"no-unused-vars": "warn",
		camelcase: "off",
		"id-length": "off",
		placehold: "off",
	},
};

export default eslintConfig;
