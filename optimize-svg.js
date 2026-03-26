#!/usr/bin/env node

/**
 * SVG Optimize script
 *
 * What this does:
 * - Accepts SVG files or folders as input
 * - If a folder is provided, processes SVG files in that folder
 * - Uses SVGO to:
 *   1. inline <style> rules where possible
 *   2. convert inline style declarations into SVG presentation attributes
 *
 * Example:
 *   <path style="fill:#000;stroke:#fff;stroke-width:2" />
 *
 * becomes:
 *   <path fill="#000" stroke="#fff" stroke-width="2"/>
 *
 * Important:
 * - This script overwrites the original SVG files in place.
 * - Not every CSS property can be converted into SVG attributes.
 */

const fs = require('fs')
const path = require('path')
const { optimize } = require('svgo')

// Finder / Automator passes selected files or folders as command-line arguments.
const inputPaths = process.argv.slice(2)

if (!inputPaths.length) {
	console.error('No SVG files or folders provided.')
	process.exit(1)
}

/**
 * SVGO configuration
 *
 * inlineStyles:
 * - moves rules from <style> elements into element styles where applicable
 *
 * convertStyleToAttrs:
 * - converts supported style="" declarations into SVG presentation attributes
 */
const config = {
	multipass: true,
	plugins: [
		{
			name: 'inlineStyles',
			params: {
				onlyMatchedOnce: false,
			},
		},
		{
			name: 'convertStyleToAttrs',
		},
	],
}

/**
 * Collect SVG files from a file or folder path.
 *
 * Current behavior:
 * - If a file is passed, include it only if it is .svg
 * - If a folder is passed, include only top-level .svg files in that folder
 *
 * Note:
 * - This is NOT recursive.
 * - If future-you wants recursive folder processing, this function is the place to change.
 */
function collectSvgFiles(targetPath) {
	const stat = fs.statSync(targetPath)

	if (stat.isFile()) {
		return path.extname(targetPath).toLowerCase() === '.svg' ? [targetPath] : []
	}

	if (stat.isDirectory()) {
		return fs
			.readdirSync(targetPath)
			.map((file) => path.join(targetPath, file))
			.filter((filePath) => {
				try {
					return (
						fs.statSync(filePath).isFile() &&
						path.extname(filePath).toLowerCase() === '.svg'
					)
				} catch {
					return false
				}
			})
	}

	return []
}

let totalProcessed = 0

for (const inputPath of inputPaths) {
	let svgFiles = []

	try {
		svgFiles = collectSvgFiles(inputPath)
	} catch (error) {
		console.error(`Cannot read: ${inputPath}`)
		continue
	}

	for (const svgPath of svgFiles) {
		try {
			const source = fs.readFileSync(svgPath, 'utf8')

			const result = optimize(source, {
				path: svgPath,
				...config,
			})

			fs.writeFileSync(svgPath, result.data, 'utf8')
			console.log(`Optimized: ${svgPath}`)
			totalProcessed++
		} catch (error) {
			console.error(`Failed: ${svgPath}`)
			console.error(error.message)
		}
	}
}

console.log(`Done. Processed ${totalProcessed} SVG file(s).`)
