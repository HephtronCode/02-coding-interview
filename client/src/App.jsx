import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";
import CodeEditor from "./CodeEditor";

const socket = io("http://localhost:3000");

export default function App() {
	const [code, setCode] = useState(
		'print("Initializing Nexus Logic...")\n\ndef add(a, b):\n    return a + b\n\nprint(f"Calculation Result: {add(10, 20)}")'
	);
	const [language, setLanguage] = useState("python");
	const [status, setStatus] = useState("Disconnected");
	const roomId = "interview-room-1";

	// WASM State
	const [output, setOutput] = useState([]);
	const [isPyodideReady, setIsPyodideReady] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const pyodideRef = useRef(null);

	useEffect(() => {
		// 1. Socket Setup
		socket.on("connect", () => {
			setStatus("Connected");
			socket.emit("join-room", roomId);
		});
		socket.on("disconnect", () => setStatus("Disconnected"));
		socket.on("code-update", (newCode) => setCode(newCode));

		// 2. Load WASM (Python) Engine
		const loadPyodideEngine = async () => {
			addToOutput("cmd: boot_sequence --target=python_wasm");
			try {
				// Load from the CDN script we added
				const pyodide = await window.loadPyodide();
				pyodideRef.current = pyodide;
				setIsPyodideReady(true);
				addToOutput("> Python Runtime loaded successfully.");
				addToOutput("> Ready for execution.");
			} catch (err) {
				addToOutput("! FATAL: Failed to load Python environment.");
				console.error(err);
			}
		};
		loadPyodideEngine();

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("code-update");
		};
	}, []);

	const addToOutput = (line) => {
		setOutput((prev) => [...prev, line]);
	};

	const handleCodeChange = (newCode) => {
		setCode(newCode);
		socket.emit("code-change", { roomId, code: newCode });
	};

	// 🚀 EXECUTION ENGINE
	const runCode = async () => {
		if (!pyodideRef.current) return;

		setIsRunning(true);
		addToOutput("---------------------------------");
		addToOutput(`> Executing script...`);

		try {
			// Reset Stdout capture to catch 'print' statements
			pyodideRef.current.setStdout({
				batched: (msg) => addToOutput(msg),
			});

			// Run the actual code
			await pyodideRef.current.runPythonAsync(code);

			addToOutput("> Execution finished.");
		} catch (err) {
			// Error Formatting
			addToOutput(`! Error: ${err.message}`);
		} finally {
			setIsRunning(false);
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col bg-[#020617] text-slate-300 font-sans overflow-hidden">
			{/* HEADER */}
			<header className="h-16 px-6 flex items-center justify-between border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md z-10">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
						<span className="font-mono text-white font-bold text-lg">
							&lt;/&gt;
						</span>
					</div>
					<h1 className="text-lg font-bold tracking-tight text-white">
						Nexus{" "}
						<span className="text-indigo-400 font-normal">Collaborate</span>
					</h1>
				</div>

				<div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
					<select
						value={language}
						onChange={(e) => setLanguage(e.target.value)}
						className="bg-transparent text-sm px-3 py-1.5 rounded-md text-slate-200 outline-none hover:bg-slate-800 transition-colors"
					>
						<option value="python">Python (WASM)</option>
						<option value="javascript">JavaScript (ReadOnly)</option>
					</select>

					<div className="w-px h-4 bg-slate-700"></div>

					<button
						onClick={runCode}
						disabled={!isPyodideReady || isRunning}
						className={`flex items-center gap-2 px-4 py-1.5 text-white text-sm font-medium rounded-md shadow-lg transition-all transform active:scale-95
               ${
									isPyodideReady && !isRunning
										? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
										: "bg-slate-700 cursor-not-allowed opacity-50"
								}`}
					>
						<span className="font-mono">▶</span>{" "}
						{isRunning ? "Running..." : "Run"}
					</button>
				</div>

				<div className="flex items-center gap-4">
					<div
						className={`w-3 h-3 rounded-full ${
							status === "Connected"
								? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
								: "bg-rose-500"
						}`}
					></div>
				</div>
			</header>

			{/* WORKSPACE */}
			<main className="flex-1 flex overflow-hidden">
				{/* Editor */}
				<div className="flex-1 flex flex-col min-w-0">
					<CodeEditor
						code={code}
						onChange={handleCodeChange}
						language="python"
					/>
				</div>

				{/* Console */}
				<div className="w-[350px] lg:w-[400px] border-l border-slate-800 bg-[#0b1121] flex flex-col font-mono text-sm">
					<div className="h-10 border-b border-slate-800 flex items-center px-4 bg-[#0f172a] justify-between">
						<span className="text-xs text-slate-400 uppercase tracking-widest">
							Console
						</span>
						<button
							onClick={() => setOutput([])}
							className="text-xs text-indigo-400 hover:text-white"
						>
							CLEAR
						</button>
					</div>

					<div className="flex-1 p-4 overflow-y-auto space-y-1">
						{!isPyodideReady && (
							<div className="text-yellow-500 animate-pulse">
								Initializing Python Core...
							</div>
						)}

						{output.map((line, i) => (
							<div
								key={i}
								className={`break-words border-l-2 pl-2 transition-colors 
                    ${
											line.startsWith("!")
												? "border-red-500 text-red-400"
												: line.startsWith("cmd:")
												? "border-zinc-700 text-zinc-500 italic"
												: line.startsWith(">")
												? "border-emerald-500/50 text-emerald-500"
												: "border-transparent text-slate-300"
										}`}
							>
								{line}
							</div>
						))}
						<div
							ref={(el) => el && el.scrollIntoView({ behavior: "smooth" })}
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
