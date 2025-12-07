import React from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, onChange, language }) {
	const handleEditorDidMount = (editor, monaco) => {
		monaco.editor.defineTheme("nexus-slate", {
			base: "vs-dark",
			inherit: true,
			rules: [
				{ token: "comment", foreground: "94a3b8", fontStyle: "italic" },
				{ token: "keyword", foreground: "818cf8", fontStyle: "bold" },
				{ token: "string", foreground: "34d399" },
			],
			colors: {
				"editor.background": "#0f172a", // Slate-900 (Matches new theme)
				"editor.foreground": "#e2e8f0",
				"editor.lineHighlightBackground": "#1e293b", // Slate-800
				"editorLineNumber.foreground": "#64748b",
				"editor.selectionBackground": "#3b82f640",
			},
		});

		monaco.editor.setTheme("nexus-slate");
	};

	return (
		<div className="h-full w-full relative">
			<Editor
				height="100%"
				width="100%"
				language={language}
				value={code}
				onChange={onChange}
				onMount={handleEditorDidMount}
				options={{
					minimap: { enabled: false }, // Cleaner look
					fontSize: 15,
					fontFamily: "JetBrains Mono",
					lineHeight: 24,
					padding: { top: 24, bottom: 24 },
					scrollBeyondLastLine: false,
					smoothScrolling: true,
					cursorBlinking: "phase",
					renderLineHighlight: "line",
					contextmenu: true,
					fontLigatures: true,
				}}
			/>
		</div>
	);
}
