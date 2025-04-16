import { useCallback } from "react";
import { type Editor } from "@tiptap/react";
import {
  Heading2,
  Bold,
  Italic,
  Code,
  ListOrdered,
  ListIcon,
  LucideTextCursor,
  Link,
} from "lucide-react";

interface ITool {
  Icon: any;
  className: string;
  onClick: () => {} | void;
  disabled?: boolean;
}
const Tool = ({ Icon, className, onClick, disabled }: ITool) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`p-2 rounded-md ${className} hover:bg-gray-200 transition-colors ease-linear`}
    >
      <Icon size={15} />
    </button>
  );
};
const ToolBar = ({ editor }: { editor: Editor | null }) => {
  const setLink = useCallback(() => {
    const url = window.prompt("URL");
    if (url === null) return;
    if (url === "") {
      return editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url || "" })
      .run();
  }, [editor]);
  if (!editor) {
    return null;
  }
  const tools: Array<ITool> = [
    {
      Icon: LucideTextCursor,
      onClick: () => editor.chain().focus().setParagraph().run(),
      className: editor.isActive("paragraph") ? "is-active" : "",
    },
    {
      Icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      className: editor.isActive("heading") ? "is-active" : "",
    },
    {
      Icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run(),
      className: editor.isActive("bold") ? "is-active" : "",
    },
    {
      Icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      className: editor.isActive("italic") ? "is-active" : "",
    },
    {
      Icon: Link,
      onClick: () => setLink(),
      className: editor.isActive("link") ? "is-active" : "",
    },
    {
      Icon: Code,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      className: editor.isActive("codeBlock") ? "is-active" : "",
    },
    {
      Icon: ListIcon,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      className: editor.isActive("bulletlist") ? "is-active" : "",
    },
    {
      Icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      className: editor.isActive("orderedlist") ? "is-active" : "",
    },
  ];

  return (
    <div className="w-[42%] flex flex-wrap flex-row justify-between">
      {tools.map(({ Icon, className, onClick, disabled }, index) => (
        <Tool
          key={index + "icon"}
          Icon={Icon}
          className={className}
          onClick={onClick}
          disabled={disabled}
        />
      ))}
    </div>
  );
};
export default ToolBar;
