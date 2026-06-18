import Select from "react-select";

// Shared react-select wrapper so every dropdown looks identical and on-brand.
// Pass options as [{ value, label }] OR a plain array of strings (auto-mapped).
const toOptions = (options) =>
    (options || []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));

const baseStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: 44,
        borderRadius: 10,
        borderColor: state.isFocused ? "#004bd6" : "#cbd5e1",
        boxShadow: state.isFocused ? "0 0 0 3px rgba(0,75,214,.12)" : "none",
        "&:hover": { borderColor: "#94a3b8" },
        fontSize: 14,
    }),
    valueContainer: (base) => ({ ...base, padding: "2px 12px" }),
    placeholder: (base) => ({ ...base, color: "#94a3b8" }),
    menu: (base) => ({ ...base, borderRadius: 10, overflow: "hidden", zIndex: 30 }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
        ...base,
        fontSize: 14,
        backgroundColor: state.isSelected ? "#004bd6" : state.isFocused ? "#eff6ff" : "#fff",
        color: state.isSelected ? "#fff" : "#0f172a",
        cursor: "pointer",
    }),
    indicatorSeparator: () => ({ display: "none" }),
};

const SelectInput = ({ value, onChange, options, placeholder = "Select…", isClearable = false, className, isDisabled = false }) => {
    const opts = toOptions(options);
    const selected = opts.find((o) => String(o.value) === String(value)) || null;
    return (
        <Select
            className={className}
            classNamePrefix="ev_select"
            options={opts}
            value={selected}
            onChange={(opt) => onChange(opt ? opt.value : "")}
            placeholder={placeholder}
            isClearable={isClearable}
            isDisabled={isDisabled}
            styles={baseStyles}
            menuPortalTarget={typeof document !== "undefined" ? document.body : null}
            menuPlacement="auto"
        />
    );
};

export default SelectInput;
