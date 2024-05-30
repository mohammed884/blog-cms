import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import ToolBar from "./ToolBar";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import "../../../../styles/publish.css";
import { CheckCircle, Loader } from "lucide-react";
interface IEditorProps {
  description: string;
  handleTyping: (richText: string) => void;
  savingStatus: boolean;
}
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "pr-4 list-disc",
      },
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    paragraph: {
      HTMLAttributes: {
        class: "mb-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "pr-4 list-decimal",
      },
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    heading: {
      HTMLAttributes: {
        class: "font-semibold text-lg",
        level: [2],
      },
      levels: [2],
    },
    // paragraph: {
    //   HTMLAttributes: {
    //     class: "text-sm",
    //   },
    // },
    codeBlock: false,
  }),
  Placeholder.configure({
    placeholder: "ابدا بمشاركة قصتك مع العالم",
  }),
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
    HTMLAttributes: {
      class: "ltr bg-red-50 p-1 rounded-sm text-sm",
    },
  }),
  Link.configure({
    HTMLAttributes: {
      class: "underline text-blue-500 cursor-pointer",
      rel: "noopener noreferrer",
    },
  }),
];

const Editor = ({ description, savingStatus, handleTyping }: IEditorProps) => {
  const editor = useEditor({
    extensions,
    content: description,
    editorProps: {
      attributes: {
        class:
          "min-h-[50vh] rounded-sm border border-gray-300 p-2 pt-3 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      handleTyping(editor.getHTML());
    },
  });
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <ToolBar editor={editor} />
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
          <span className="flex gap-2">
            {savingStatus ? (
              <CheckCircle size={15} color="green" />
            ) : (
              <Loader size={15} className="animate-pulse" />
            )}
          </span>
          <p className="text-sm">{savingStatus ? "saved" : "being saved"}</p>
        </div>
      </div>
      <EditorContent editor={editor} autoFocus={true} />
    </div>
  );
};
export default Editor;
