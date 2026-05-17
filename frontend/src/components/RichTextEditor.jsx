import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon, List,  Quote, Code, Type } from "lucide-react";
import { Mic, MicOff } from "lucide-react";
const RichTextEditor = ({
  content,
  onChange
}) => {

  const editor = useEditor({

    extensions: [
      StarterKit,
      Underline
    ],

    content,

    immediatelyRender: false,

    onUpdate: ({ editor }) => {

      onChange(
        editor.getHTML()
      );
    }
  });

  const [isListening, setIsListening] = useState(false);

    const recognitionRef = useRef(null);

  // IMPORTANT:
  // Sync external content changes
  // (socket updates / fetch note)

  useEffect(() => {
  if (!editor) return;

  const isSame = editor.getHTML() === content;

  if (!isSame) {
    editor.commands.setContent(content || "", false);
  }
}, [content, editor]);


useEffect(() => {
  if (typeof window === "undefined") return;

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let transcript = "";

    for (
      let i = event.resultIndex;
      i < event.results.length;
      i++
    ) {
      transcript += event.results[i][0].transcript;
    }

    if (editor) {
      editor.chain().focus().insertContent(transcript + " ").run();
    }
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognitionRef.current = recognition;
}, [editor]);


const startListening = () => {
  if (!recognitionRef.current) return;

  setIsListening(true);

  recognitionRef.current.start();
};

const stopListening = () => {
  if (!recognitionRef.current) return;

  recognitionRef.current.stop();

  setIsListening(false);
};

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 shadow-[0_30px_60px_rgba(15,23,42,0.35)]">
      <div className="sticky top-0 z-20 border-b border-slate-800/70 bg-slate-950/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {[
            {
              label: "Bold",
              icon: Bold,
              active: editor.isActive("bold"),
              action: () => editor.chain().focus().toggleBold().run()
            },
            {
              label: "Italic",
              icon: Italic,
              active: editor.isActive("italic"),
              action: () => editor.chain().focus().toggleItalic().run()
            },
            {
              label: "Underline",
              icon: UnderlineIcon,
              active: editor.isActive("underline"),
              action: () => editor.chain().focus().toggleUnderline().run()
            },
            {
              label: "Heading",
              icon: Type,
              active: editor.isActive("heading", { level: 1 }),
              action: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
            },
            {
              label: "Quote",
              icon: Quote,
              active: editor.isActive("blockquote"),
              action: () => editor.chain().focus().toggleBlockquote().run()
            },
            {
              label: "Code",
              icon: Code,
              active: editor.isActive("codeBlock"),
              action: () => editor.chain().focus().toggleCodeBlock().run()
            },
            {
              label: "Bullet list",
              icon: List,
              active: editor.isActive("bulletList"),
              action: () => editor.chain().focus().toggleBulletList().run()
            },
            {
              label: "Numbered list",
              icon: List,
              active: editor.isActive("orderedList"),
              action: () => editor.chain().focus().toggleOrderedList().run()
            },
            {
                label: isListening ? "Stop Voice" : "Voice",
                icon: isListening ? MicOff : Mic,
                active: isListening,
                action: () => {
                    if (isListening) {
                    stopListening();
                    } else {
                    startListening();
                    }
                }
            }
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
  key={tool.label}
  type="button"
  onMouseDown={(e) => {
    e.preventDefault();
    tool.action();
  }}
  className={`inline-flex items-center gap-2 rounded-2xl cursor-pointer border px-3 py-2 text-sm transition ${
    tool.active
      ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
      : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-900/95"
  }`}
>
  <Icon size={16} />
  <span className="hidden sm:inline">{tool.label}</span>
</button>
            );
          })}
        </div>
      </div>

      <div className="relative bg-slate-950/90 p-4 min-h-[520px]">
        {editor.isEmpty && !editor.isFocused && (
          <div className="pointer-events-none absolute inset-x-6 top-6 text-slate-500">Start writing your note and format it from the toolbar above.</div>
        )}
<EditorContent
  editor={editor}
className="
    min-h-[480px]
    prose
    prose-invert
    max-w-none

    [&_.ProseMirror]:min-h-[480px]
    [&_.ProseMirror]:outline-none
    [&_.ProseMirror]:border-none
    [&_.ProseMirror]:focus:outline-none

    [&_.ProseMirror]:rounded-2xl
    [&_.ProseMirror]:p-2

    [&_.ProseMirror-focused]:ring-0
    [&_.ProseMirror-focused]:outline-none

    [&_ul]:list-disc
    [&_ol]:list-decimal
    [&_ul]:pl-6
    [&_ol]:pl-6

    [&_blockquote]:border-l-4
    [&_blockquote]:border-cyan-400
    [&_blockquote]:pl-4
    [&_blockquote]:italic
    [&_blockquote]:text-slate-300
  "
/>
      </div>
    </div>
  );
};

export default RichTextEditor;