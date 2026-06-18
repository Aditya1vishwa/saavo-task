const SettingsTableCard = ({
    title,
    fields = [],
    values = {},
    onChange,
    actionLabel,
    actionLoadingLabel,
    loading = false,
    onAction,
}) => {
    return (
        <section className="pr_settings__card">
            <h2>{title}</h2>
            <div className="pr_settings__form">
                {fields.map((field) => (
                    <div className="pr_settings__form_group" key={field.name}>
                        <label>{field.label}</label>
                        <input
                            className="pr_settings__input"
                            type={field.type || "text"}
                            name={field.name}
                            value={values[field.name] || ""}
                            onChange={onChange}
                            placeholder={field.placeholder || ""}
                        />
                    </div>
                ))}
            </div>
            <div className="pr_settings__actions">
                <button className="pr_settings__cta" type="button" onClick={onAction}>
                    {loading ? (actionLoadingLabel || "Saving...") : actionLabel}
                </button>
            </div>
        </section>
    );
};

export default SettingsTableCard;
