import { useEffect, useMemo, useState } from "react";
import CustomTable from "../../components/common/CustomTable";
import Modal from "../../components/Modal";
import { apiCall } from "../../apiConfig/apiCall";

const HelpDesk = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [answerModalOpen, setAnswerModalOpen] = useState(false);
    const [activeTicket, setActiveTicket] = useState(null);
    const [answer, setAnswer] = useState("");

    const loadTickets = async (nextPage = page) => {
        const query = new URLSearchParams({ page: String(nextPage), limit: "10" });
        if (statusFilter) query.set("status", statusFilter);
        const res = await apiCall({ url: `/admin/help-tickets?${query.toString()}`, method: "GET" });
        if (res?.success) {
            setItems(res?.data?.items || []);
            setTotalPages(res?.data?.totalPages || 1);
        }
    };

    useEffect(() => {
        loadTickets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, statusFilter]);

    const columns = useMemo(
        () => [
            { label: "User", key: "user", render: (row) => row?.userId?.email || "-" },
            { label: "Subject", key: "subject" },
            { label: "Query", key: "query" },
            { label: "Status", key: "status" },
            { label: "Answer", key: "answer", render: (row) => row?.answer || "-" },
            {
                label: "Action",
                key: "action",
                render: (row) => (
                    <button
                        className="pr_btn_primary"
                        style={{ padding: "8px 10px", fontSize: "12px" }}
                        onClick={() => {
                            setActiveTicket(row);
                            setAnswer(row.answer || "");
                            setAnswerModalOpen(true);
                        }}
                    >
                        {row.status === "answered" ? "Update Answer" : "Answer"}
                    </button>
                ),
            },
        ],
        []
    );

    const submitAnswer = async () => {
        if (!activeTicket?._id || !answer.trim()) return;
        await apiCall({
            url: `/admin/help-tickets/${activeTicket._id}/answer`,
            method: "POST",
            data: { answer },
        });
        setAnswerModalOpen(false);
        setAnswer("");
        await loadTickets();
    };

    return (
        <div className="pr_admin_page">
            <div className="pr_admin_header">
                <div>
                    <h2>Help Desk</h2>
                    <p>Review and answer user support queries.</p>
                </div>
                <select className="pr_select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All status</option>
                    <option value="open">Open</option>
                    <option value="answered">Answered</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            <CustomTable data={items} columns={columns} currentPage={page} totalPages={totalPages} onPageChange={setPage} />

            <Modal
                isOpen={answerModalOpen}
                onClose={() => setAnswerModalOpen(false)}
                title="Answer Help Query"
                footer={(
                    <div className="pr_modal_actions">
                        <button className="pr_btn_secondary" onClick={() => setAnswerModalOpen(false)}>Cancel</button>
                        <button className="pr_btn_primary" onClick={submitAnswer}>Submit Answer</button>
                    </div>
                )}
            >
                <div className="pr_form_stack">
                    <p><strong>Subject:</strong> {activeTicket?.subject}</p>
                    <p><strong>Query:</strong> {activeTicket?.query}</p>
                    <textarea className="pr_interview__textarea" rows={6} placeholder="Type your response" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                </div>
            </Modal>
        </div>
    );
};

export default HelpDesk;
