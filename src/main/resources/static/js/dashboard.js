// ============================================================
// GRIEVANCETRACK - DASHBOARD JAVASCRIPT
// ============================================================


// Load dashboard data
async function loadDashboard() {

    try {

        // Call Spring Boot REST API
        const response = await fetch("/api/grievances");


        // Check API response
        if (!response.ok) {

            throw new Error(
                "Failed to load grievances"
            );

        }


        // Convert response to JSON
        const grievances = await response.json();


        // ====================================================
        // TOTAL GRIEVANCES
        // ====================================================

        document.getElementById(
            "totalGrievances"
        ).textContent = grievances.length;


        // ====================================================
        // PENDING GRIEVANCES
        // ====================================================

        const pending = grievances.filter(
            grievance =>
                grievance.status === "SUBMITTED" ||
                grievance.status === "ASSIGNED" ||
                grievance.status === "IN_PROGRESS"
        ).length;


        document.getElementById(
            "pendingGrievances"
        ).textContent = pending;


        // ====================================================
        // RESOLVED GRIEVANCES
        // ====================================================

        const resolved = grievances.filter(
            grievance =>
                grievance.status === "RESOLVED" ||
                grievance.status === "CLOSED"
        ).length;


        document.getElementById(
            "resolvedGrievances"
        ).textContent = resolved;


        // ====================================================
        // ESCALATED GRIEVANCES
        // ====================================================

        const escalated = grievances.filter(
            grievance =>
                grievance.status === "ESCALATED"
        ).length;


        document.getElementById(
            "escalatedGrievances"
        ).textContent = escalated;


        // ====================================================
        // RECENT GRIEVANCES
        // ====================================================

        // Take latest 5 grievances
        const recentGrievances =
            grievances
                .slice(-5)
                .reverse();


        const table =
            document.getElementById(
                "recentGrievances"
            );


        // If there are no grievances
        if (recentGrievances.length === 0) {

            table.innerHTML = `
                <tr>

                    <td colspan="5"
                        style="text-align:center;">

                        No grievances found.

                    </td>

                </tr>
            `;

            return;
        }


        // ====================================================
        // DISPLAY TABLE DATA
        // ====================================================

        table.innerHTML =
            recentGrievances.map(
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
                        ${grievance.location}
                    </td>

                    <td>

                        <span class="status status-${getStatusClass(grievance.status)}">

                            ${formatStatus(grievance.status)}

                        </span>

                    </td>

                </tr>

            `
            ).join("");


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        // Display error message
        const table =
            document.getElementById(
                "recentGrievances"
            );


        table.innerHTML = `
            <tr>

                <td colspan="5"
                    style="text-align:center;">

                    Unable to load grievances.

                </td>

            </tr>
        `;

    }

}



// ============================================================
// STATUS → CSS CLASS
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
// FORMAT STATUS TEXT
// ============================================================

function formatStatus(status) {

    return status
        .replace("_", " ");

}



// ============================================================
// LOAD DASHBOARD
// ============================================================

loadDashboard();