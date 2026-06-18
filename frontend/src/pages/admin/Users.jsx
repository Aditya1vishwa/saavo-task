import { useEffect, useMemo, useState } from "react";
import Modal from "../../components/Modal";
import CustomTable from "../../components/common/CustomTable";
import SelectInput from "../../components/common/SelectInput";
import { apiCall } from "../../apiConfig/apiCall";
import svg from "../../assets/svg";

const emptyEdit = { _id: "", name: "", email: "", phone: "", status: "active", role: "user", userType: "attendee" };

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(emptyEdit);

    const loadUsers = async (nextPage = page, nextSearch = search) => {
        const res = await apiCall({
            url: `/admin/users?page=${nextPage}&limit=10&search=${encodeURIComponent(nextSearch)}`,
            method: "GET",
        });
        if (res?.success) {
            setUsers(res?.data?.users || []);
            setTotalPages(res?.data?.totalPages || 1);
        }
    };

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const columns = useMemo(
        () => [
            { label: "Name", key: "name" },
            { label: "Email", key: "email" },
            { label: "Role", key: "role", render: (row) => row.role || "user" },
            { label: "Type", key: "userType", render: (row) => row.userType || "attendee" },
            { label: "Status", key: "status" },
            {
                label: "Actions",
                key: "actions",
                render: (row) => (
                    <div className="pr_table_actions">
                        <button
                            type="button"
                            className="pr_icon_action"
                            onClick={() => {
                                setSelectedUser({
                                    _id: row._id,
                                    name: row.name || "",
                                    email: row.email || "",
                                    phone: row.phone || "",
                                    status: row.status || "active",
                                    role: row.role || "user",
                                    userType: row.userType || "attendee",
                                });
                                setEditModalOpen(true);
                            }}
                        >
                            {svg.edit({})}
                        </button>
                        <button
                            type="button"
                            className="pr_icon_action"
                            onClick={() => {
                                setSelectedUser(row);
                                setDeleteModalOpen(true);
                            }}
                        >
                            {svg.delete({})}
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const updateUser = async () => {
        await apiCall({
            url: `/admin/users/${selectedUser._id}`,
            method: "PATCH",
            data: {
                name: selectedUser.name,
                email: selectedUser.email,
                phone: selectedUser.phone,
                status: selectedUser.status,
                role: selectedUser.userType === "organizer" ? "organizer" : "user",
            },
        });
        setEditModalOpen(false);
        await loadUsers();
    };

    const deleteUser = async () => {
        await apiCall({ url: `/admin/users/${selectedUser._id}`, method: "DELETE" });
        setDeleteModalOpen(false);
        await loadUsers();
    };

    return (
        <div className="pr_admin_page">
            <div className="pr_admin_header">
                <div>
                    <h2>Users</h2>
                    <p>Manage platform users and their roles.</p>
                </div>
                <div className="pr_search_wrapper">
                    <input
                        className="pr_input"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name or email"
                    />
                    <button
                        className="pr_btn_primary"
                        onClick={() => {
                            setPage(1);
                            loadUsers(1, search);
                        }}
                    >
                        Search
                    </button>
                </div>
            </div>

            <CustomTable data={users} columns={columns} currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit User"
                footer={(
                    <div className="pr_modal_actions">
                        <button className="pr_btn_secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                        <button className="pr_btn_primary" onClick={updateUser}>Save</button>
                    </div>
                )}
            >
                <div className="pr_form_stack">
                    <input className="pr_input" placeholder="Name" value={selectedUser.name || ""} onChange={(e) => setSelectedUser((p) => ({ ...p, name: e.target.value }))} />
                    <input className="pr_input" placeholder="Email" value={selectedUser.email || ""} onChange={(e) => setSelectedUser((p) => ({ ...p, email: e.target.value }))} />
                    <input className="pr_input" placeholder="Phone" value={selectedUser.phone || ""} onChange={(e) => setSelectedUser((p) => ({ ...p, phone: e.target.value }))} />
                    <label className="pr_label">User type</label>
                    <SelectInput
                        options={[{ value: "attendee", label: "Attendee" }, { value: "organizer", label: "Organizer" }]}
                        value={selectedUser.userType || "attendee"}
                        onChange={(v) => setSelectedUser((p) => ({ ...p, userType: v }))}
                    />
                    <label className="pr_label">Status</label>
                    <SelectInput
                        options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "suspended", label: "Suspended" }]}
                        value={selectedUser.status || "active"}
                        onChange={(v) => setSelectedUser((p) => ({ ...p, status: v }))}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Delete User"
                footer={(
                    <div className="pr_modal_actions">
                        <button className="pr_btn_secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                        <button className="pr_btn_primary" style={{ backgroundColor: "var(--color-danger)" }} onClick={deleteUser}>Delete</button>
                    </div>
                )}
            >
                <p>Delete {selectedUser?.name || "this user"}? This updates user status to deleted.</p>
            </Modal>
        </div>
    );
};

export default Users;
