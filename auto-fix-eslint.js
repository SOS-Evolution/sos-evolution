const fs = require('fs');

const report = JSON.parse(fs.readFileSync('lint-report.json', 'utf8'));

for (const fileResult of report) {
    if (fileResult.errorCount === 0 && fileResult.warningCount === 0) continue;

    let content = fs.readFileSync(fileResult.filePath, 'utf8');
    const lines = content.split('\n');
    let modifications = 0;

    // Fixes in reverse order to not mess up line numbers
    const messages = fileResult.messages.sort((a, b) => {
        if (a.line !== b.line) return b.line - a.line;
        return b.column - a.column;
    });

    for (const msg of messages) {
        if (msg.ruleId === '@typescript-eslint/no-explicit-any') {
            const lineIdx = msg.line - 1;
            let line = lines[lineIdx];
            // Replace 'any' with 'unknown' exactly at column
            // Note: column is 1-based, but we'll just do a simple replace of 'any' to 'unknown' on that line
            const before = line.substring(0, msg.column - 1);
            const after = line.substring(msg.column - 1);
            const newAfter = after.replace(/\bany\b/, 'unknown');
            if (after !== newAfter) {
                lines[lineIdx] = before + newAfter;
                modifications++;
            }
        } else if (msg.ruleId === 'react/no-unescaped-entities') {
            const lineIdx = msg.line - 1;
            let line = lines[lineIdx];
            if (line.includes('"')) {
                lines[lineIdx] = line.replace(/"/g, '&quot;');
                modifications++;
            } else if (line.includes("'")) {
                lines[lineIdx] = line.replace(/'/g, '&apos;');
                modifications++;
            }
        }
    }

    if (modifications > 0) {
        fs.writeFileSync(fileResult.filePath, lines.join('\n'), 'utf8');
        console.log(`Fixed ${modifications} issues in ${fileResult.filePath}`);
    }
}
