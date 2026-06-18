import { useEffect, useMemo, useState } from "react";
import Modal from "../../components/Modal";
import CustomTable from "../../components/common/CustomTable";
import { apiCall } from "../../apiConfig/apiCall";

const HelpSupport = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [subject, setSubject] = useState("");
    const [query, setQuery] = useState("");

    const loadData = async (nextPage = page) => {
        const res = await apiCall({ url: `/user/help-tickets?page=${nextPage}&limit=10`, method: "GET" });
        if (res?.success) {
            setItems(res?.data?.items || []);
            setTotalPages(res?.data?.totalPages || 1);
        }
    };

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const columns = useMemo(
        () => [
            { label: "Subject", key: "subject" },
            { label: "Query", key: "query" },
            { label: "Status", key: "status" },
            {
                label: "Answer",
                key: "answer",
                render: (row) => row.answer || "Pending",
            },
            {
                label: "Updated",
                key: "updatedAt",
                render: (row) => new Date(row.updatedAt).toLocaleString(),
            },
        ],
        []
    );

    const submitQuery = async () => {
        if (!subject.trim() || !query.trim()) {
            alert("Please fill both subject and query.");
            return;
        }

        const res = await apiCall({
            url: "/user/help-tickets",
            method: "POST",
            data: { subject, query },
        });

        if (res?.success) {
            setOpenModal(false);
            setSubject("");
            setQuery("");
            await loadData(1);
            setPage(1);
        }
    };

    return (
        <div className="pr_admin_page">
            <div className="pr_admin_header">
                <div>
                    <h2>Need Help</h2>
                    <p>Submit your query and track admin responses here.</p>
                </div>
                <button className="pr_btn_primary" onClick={() => setOpenModal(true)}>Ask Question</button>
            </div>

            <CustomTable data={items} columns={columns} currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title="Submit Query"
                footer={(
                    <div className="pr_modal_actions">
                        <button className="pr_btn_secondary" onClick={() => setOpenModal(false)}>Cancel</button>
                        <button className="pr_btn_primary" onClick={submitQuery}>Submit</button>
                    </div>
                )}
            >
                <div className="pr_form_stack">
                    <input className="pr_input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                    <textarea className="pr_interview__textarea" rows={6} placeholder="Describe your issue" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
            </Modal>
        </div>
    );
};

export default HelpSupport;
