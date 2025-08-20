import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface CodeEditorProps {
	value: string;
	language: string;
	className?: string;
	placeholder?: string;
	onChange: (code: string) => void;
	onReady?: () => void;
}

/**
 * CodeEditor: Robust editor with Monaco first, textarea fallback.
 * - Avoids inline styles for linter compliance
 * - Cleans up listeners/workers safely
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
	value,
	language,
	className,
	placeholder = 'Start typing your code here...',
	onChange,
	onReady,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef<any>(null);
	const onChangeRef = useRef(onChange);
	const [useFallback, setUseFallback] = useState(false);
	const [isReady, setIsReady] = useState(false);

	const destroyEditor = useCallback(() => {
		try {
			if (editorRef.current && typeof editorRef.current.dispose === 'function') {
				editorRef.current.dispose();
				editorRef.current = null;
			}
		} catch {}
	}, []);

	// Keep latest onChange without re-initializing editor
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (useFallback) return;
		if (!containerRef.current) return;

		// Guard: monaco not available → fallback
		if (!window.monaco || !window.monaco.editor) {
			setUseFallback(true);
			return;
		}

		try {
			const editor = window.monaco.editor.create(containerRef.current, {
				value,
				language,
				automaticLayout: true,
				theme: 'vs-dark',
			});
			editorRef.current = editor;

			const changeDisposable = editor.onDidChangeModelContent(() => {
				try {
					const v = editor.getValue();
					onChangeRef.current(v);
				} catch {}
			});

			setIsReady(true);
			onReady?.();

			return () => {
				try { changeDisposable?.dispose?.(); } catch {}
				destroyEditor();
			};
		} catch (e) {
			setUseFallback(true);
		}
	}, [useFallback, language, onReady, destroyEditor]);

	// Keep Monaco value in sync when parent value changes externally
	useEffect(() => {
		try {
			if (!useFallback && isReady && editorRef.current) {
				const current = editorRef.current.getValue?.();
				if (typeof current === 'string' && current !== value) {
					editorRef.current.setValue(value);
				}
			}
		} catch {}
	}, [value, isReady, useFallback]);

	return (
		<div className={className}>
			{useFallback ? (
				<textarea
					className="h-full w-full p-3 font-mono text-sm bg-background text-foreground outline-none resize-none"
					value={value}
					placeholder={placeholder}
					onChange={(e) => onChange(e.target.value)}
				/>
			) : (
				<div ref={containerRef} className="h-full w-full" />
			)}
		</div>
	);
};

export default CodeEditor;


