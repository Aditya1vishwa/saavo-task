import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import CustomTable from "../../components/common/CustomTable";
import Modal from "../../components/Modal";
import { apiCall } from "../../apiConfig/apiCall";
import svg from "../../assets/svg";

const emptyForm = {
    _id: "",
    type: "",
    key: "",
    valueType: "string",
    value: "",
    status: "active",
};

const KeyValueType = () => {
    const [items, setItems] = useState([]);
    const [types, setTypes] = useState([]);
    const [typeFilter, setTypeFilter] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const valueTypeOptions = useMemo(
        () => [
            { label: "String", value: "string" },
            { label: "Object", value: "object" },
            { label: "Array", value: "array" },
        ],
        []
    );
    const statusOptions = useMemo(
        () => [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
        ],
        []
    );

    const typeOptions = useMemo(() => types.map((type) => ({ label: type, value: type })), [types]);

    const loadTypes = async () => {
        const res = await apiCall({ url: "/admin/key-values/types", method: "GET" });
        if (res?.success) {
            setTypes(res?.data?.types || []);
        }
    };

    const loadItems = async (nextPage = page) => {
        const params = new URLSearchParams({ page: String(nextPage), limit: "10" });
        if (typeFilter?.value) params.set("type", typeFilter.value);
        if (search) params.set("search", search);
        const res = await apiCall({ url: `/admin/key-values?${params.toString()}`, method: "GET" });
        if (res?.success) {
            setItems(res?.data?.items || []);
            setTotalPages(res?.data?.totalPages || 1);
        }
    };

    useEffect(() => {
        loadTypes();
    }, []);

    useEffect(() => {
        loadItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, typeFilter]);

    const columns = useMemo(
        () => [
            { label: "Type", key: "type" },
            { label: "Key", key: "key" },
            { label: "Value Type", key: "valueType" },
            {
                label: "Value",
                key: "value",
                render: (row) => {
                    if (row.valueType === "string") return row.value;
                    return JSON.stringify(row.value);
                },
            },
            { label: "Status", key: "status" },
            {
                label: "Actions",
                key: "action",
                render: (row) => (
                    <div className="pr_table_actions">
                        <button
                            className="pr_icon_action"
                            onClick={() => {
                                setForm({
                                    _id: row._id,
                                    type: row.type,
                                    key: row.key,
                                    valueType: row.valueType,
                                    value: row.valueType === "string" ? String(row.value || "") : JSON.stringify(row.value || {}, null, 2),
                                    status: row.status,
                                });
                                setModalOpen(true);
                            }}
                        >
                            {svg.edit({})}
                        </button>
                        <button
                            className="pr_icon_action"
                            onClick={async () => {
                                await apiCall({ url: `/admin/key-values/${row._id}`, method: "DELETE" });
                                await loadItems();
                            }}
                        >
                            {svg.delete({})}
                        </button>
                    </div>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const validateFormValue = () => {
        if (form.valueType === "string") {
            return true;
        }

        try {
            const parsed = JSON.parse(form.value || "");
            if (form.valueType === "object" && (!parsed || Array.isArray(parsed) || typeof parsed !== "object")) {
                return false;
            }
            if (form.valueType === "array" && !Array.isArray(parsed)) {
                return false;
            }
            return true;
        } catch {
            return false;
        }
    };

    const saveItem = async () => {
        if (!form.type || !form.key) {
            alert("Type and key are required");
            return;
        }
        if (!validateFormValue()) {
            alert("Value does not match selected value type");
            return;
        }

        const payload = {
            type: form.type,
            key: form.key,
            valueType: form.valueType,
            value: form.value,
            status: form.status,
        };

        if (form._id) {
            await apiCall({ url: `/admin/key-values/${form._id}`, method: "PATCH", data: payload });
        } else {
            await apiCall({ url: "/admin/key-values", method: "POST", data: payload });
        }

        setModalOpen(false);
        setForm(emptyForm);
        await Promise.all([loadTypes(), loadItems(1)]);
        setPage(1);
    };

    return (
        <div className="pr_admin_page">
            <div className="pr_admin_header">
                <div>
                    <h2>Key / Value Type</h2>
                    <p>Manage frontend configurable key-value pairs with type filtering.</p>
                </div>
                <div className="pr_search_wrapper">
                    <div style={{ minWidth: 180 }}>
                        <Select
                            className="pr_select_wrapper"
                            classNamePrefix="pr_select"
                            isClearable
                            placeholder="Filter by type"
                            value={typeFilter}
                            options={typeOptions}
                            onChange={setTypeFilter}
                        />
                    </div>
                    <input className="pr_input" placeholder="Search type/key" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button className="pr_btn_primary" onClick={() => loadItems(1)}>Apply</button>
                    <button style={{ width: "100%" }} className="pr_btn_secondary" onClick={() => { setForm(emptyForm); setModalOpen(true); }}>Add Pair</button>
                </div>
            </div>

            <CustomTable data={items} columns={columns} currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={form._id ? "Edit Key Value" : "Add Key Value"}
                footer={(
                    <div className="pr_modal_actions">
                        <button className="pr_btn_secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="pr_btn_primary" onClick={saveItem}>Save</button>
                    </div>
                )}
            >
                <div className="pr_form_stack">
                    <div className="pr_form_group">
                        <label>Type</label>
                        <input className="pr_input" placeholder="Type (new or existing)" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} />
                    </div>
                    <div className="pr_form_group">
                        <label>Key</label>
                        <input className="pr_input" placeholder="Key" value={form.key} onChange={(e) => setForm((p) => ({ ...p, key: e.target.value }))} />
                    </div>
                    <div className="pr_form_group">
                        <label>Value Type</label>
                        <Select
                            className="pr_select_wrapper"
                            classNamePrefix="pr_select"
                            value={valueTypeOptions.find((opt) => opt.value === form.valueType) || null}
                            options={valueTypeOptions}
                            onChange={(option) => setForm((p) => ({ ...p, valueType: option?.value || "string" }))}
                        />
                    </div>
                    <div className="pr_form_group">
                        <label>Value</label>
                        <textarea className="pr_interview__textarea" rows={6} placeholder={form.valueType === "string" ? "Simple text value" : "Valid JSON value"} value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} />
                    </div>
                    <div className="pr_form_group">
                        <label>Status</label>
                        <Select
                            className="pr_select_wrapper"
                            classNamePrefix="pr_select"
                            value={statusOptions.find((opt) => opt.value === form.status) || null}
                            options={statusOptions}
                            onChange={(option) => setForm((p) => ({ ...p, status: option?.value || "active" }))}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default KeyValueType;
