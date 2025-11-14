import { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import './css/rich-text-editor.css'; 
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className,
  readOnly = false,
}: RichTextEditorProps) => {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          // Text formatting
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],

          // Basic formatting
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],

          // Text alignment
          [{ align: [] }],

          // Lists and indentation
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],

          // Links and media
          ["link", "image", "video"],

          // Quotes and code
          ["blockquote", "code-block"],

          // Utility
          ["clean"], // Remove formatting
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
    "align",
  ];

  return (
    <div className={cn("rich-text-editor", className)}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        style={{
          minHeight: "300px",
        }}
      />
      {/* css is here  */}
    </div>
  );
};
