// ============================================================
// GRIEVANCETRACK - GRIEVANCES PAGE
// ============================================================


async function loadGrievances() {

    const table =
        document.getElementById("grievancesTable");

    try {

        const response =
            await fetch("/api/grievances");

        if (!response.ok) {

            throw new Error(
                "Failed to load grievances"
            );

        }

        const grievances =
            await response.json();


        if (grievances.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="7">

                        <div class="empty-state">

                            <h3>
                                No grievances found
                            </h3>

                            <p>
                                No citizen complaints have been submitted yet.
                            </p>

                        </div>

                    </td>

                </tr>

            `;

            return;
        }


        table.innerHTML =
            grievances.map(
                grievance => `

                <tr>

                    <td>
                        #${grievance.id}
                    </td>

                    <td>
                        ${grievance.citizenName}
                    </td>

                    <td>
                        ${
                    grievance.category
                        ? grievance.category.name
                        : "N/A"
                }
                    </td>

                    <td>
                        ${
                    grievance.category &&
                    grievance.category.department
                        ? grievance.category.department.name
                        : "N/A"
                }
                    </td>

                    <td>
                        ${grievance.location}
                    </td>

                    <td>

                        <span class="status status-${getStatusClass(grievance.status)}">

                            ${formatStatus(grievance.status)}

                        </span>

                    </td>

                    <td>

                        <a
                            href="/grievance-details.html?id=${grievance.id}"
                            class="btn btn-secondary">

                            View

                        </a>

                    </td>

                </tr>

            `
            ).join("");


    } catch (error) {

        console.error(
            "Grievance Loading Error:",
            error
        );

        table.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <h3>
                            Unable to load grievances
                        </h3>

                        <p>
                            Please check whether the Spring Boot server is running.
                        </p>

                    </div>

                </td>

            </tr>

        `;

    }

}


// ============================================================
// STATUS CLASS
// ============================================================

function getStatusClass(status) {

    const statusClasses = {

        SUBMITTED: "submitted",

        ASSIGNED: "assigned",

        IN_PROGRESS: "progress",

        RESOLVED: "resolved",

        CLOSED: "closed",

        ESCALATED: "escalated"

    };

    return statusClasses[status]
        || "submitted";
}


// ============================================================
// FORMAT STATUS
// ============================================================

function formatStatus(status) {

    return status
        .replace("_", " ");

}


// ============================================================
// INITIAL LOAD
// ============================================================

loadGrievances();