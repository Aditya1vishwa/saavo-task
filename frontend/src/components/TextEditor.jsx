import { Editor } from "@tinymce/tinymce-react";

const font_family = ["Poppins", "Outfit", "Inter", "Roboto", "Montserrat"];
const fontFormats = font_family.map((font) => `${font}=${font}, sans-serif`).join(";");

const TextEditor = ({ value = "", onChange, onBlur, height = 320, placeholder = "Write here..." }) => (
  <Editor
    value={value}
    tinymceScriptSrc="/tinymce/tinymce.min.js"
    licenseKey="gpl"
    init={{
      base_url: "/tinymce",
      suffix: ".min",
      skin_url: "/tinymce/skins/ui/oxide",
      content_css: "/tinymce/skins/content/default/content.min.css",
      plugins: ["link", "lists"],
      toolbar:
        "fontfamily fontsize | bold italic underline forecolor backcolor | " +
        "alignleft aligncenter alignright alignjustify | bullist numlist | link | removeformat",
      link_default_protocol: "https",
      link_assume_external_targets: true,
      link_target_list: [
        { title: "Same tab", value: "" },
        { title: "New tab", value: "_blank" },
      ],
      default_link_target: "_blank",
      rel_list: [
        { title: "None", value: "" },
        { title: "Noopener Noreferrer", value: "noopener noreferrer" },
      ],
      link_quicklink: true,
      // menubar: false,
      branding: false,
      promotion: false,
      zindex: 3005,
      toolbar_mode: "sliding",
      height,
      placeholder,
      font_family_formats: fontFormats,
      content_style: `
        body {
          font-family: Poppins, Outfit, Inter, Roboto, Montserrat, sans-serif;
          font-size: 14px;
          color: #0f172a;
        }
        a { color: #7c3aed; }
      `,
    }}
    onEditorChange={onChange}
    onBlur={onBlur}
  />
);

export default TextEditor;
