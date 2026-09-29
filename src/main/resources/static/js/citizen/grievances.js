document.addEventListener("DOMContentLoaded", loadGrievances);

async function loadGrievances() {

    const table = document.getElementById("grievancesTable");
    const countElement = document.getElementById("grievanceCount");

    try {

        const response = await fetch("/api/grievances");

        if (!response.ok) {
            throw new Error("Failed to load grievances");
        }

        const grievances = await response.json();

        if (countElement) {
            countElement.textContent =
                `${grievances.length} ${
                    grievances.length === 1
                        ? "Grievance"
                        : "Grievances"
                }`;
        }

        if (grievances.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-citizen">

                            <div class="empty-citizen-icon">
                                📭
                            </div>

                            <h3>
                                No Grievances Found
                            </h3>

                            <p>
                                You have not submitted any grievances yet.
                            </p>

                            <a
                                href="/citizen/submit.html"
                                class="submit-link">

                                Submit Your First Grievance

                            </a>

                        </div>
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML = grievances.map(grievance => {

            return `
                <tr>

                    <td>
                        #${grievance.id}
                    </td>

                    <td>
                        ${escapeHtml(
                grievance.category?.name || "-"
            )}
                    </td>

                    <td>
                        ${escapeHtml(
                grievance.location || "-"
            )}
                    </td>

                    <td>
                        <span class="status ${getStatusClass(grievance.status)}">
                            ${formatStatus(grievance.status)}
                        </span>
                    </td>

                    <td>
                        ${formatDate(grievance.createdAt)}
                    </td>

                    <td>

                        <a
                            href="/citizen/grievance-details.html?id=${grievance.id}"
                            class="view-button">

                            View Details

                        </a>

                    </td>

                </tr>
            `;

        }).join("");

    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="6">

                    <div class="alert alert-error">
                        Unable to load grievances.
                        Please try again.
                    </div>

                </td>
            </tr>
        `;
    }
}


function getStatusClass(status) {

    switch (status) {

        case "SUBMITTED":
            return "status-submitted";

        case "ASSIGNED":
            return "status-assigned";

        case "IN_PROGRESS":
            return "status-progress";

        case "RESOLVED":
            return "status-resolved";

        case "CLOSED":
            return "status-closed";

        case "ESCALATED":
            return "status-escalated";

        default:
            return "";
    }
}


function formatStatus(status) {

    if (!status) {
        return "-";
    }

    return status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(dateString);

    return date.toLocaleString();
}


function escapeHtml(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}