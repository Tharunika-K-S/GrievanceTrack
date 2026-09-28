// ============================================================
// GRIEVANCETRACK - ESCALATIONS
// ============================================================


async function loadEscalations() {

    const table =
        document.getElementById("escalationsTable");

    try {

        const response =
            await fetch("/api/escalations");

        if (!response.ok) {

            throw new Error(
                "Failed to load escalations"
            );

        }

        const escalations =
            await response.json();


        if (escalations.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="7">

                        <div class="empty-state">

                            <h3>
                                No Escalations
                            </h3>

                            <p>
                                No grievances have been escalated yet.
                            </p>

                        </div>

                    </td>

                </tr>

            `;

            return;
        }


        table.innerHTML =
            escalations.map(
                escalation => {

                    const grievance =
                        escalation.grievance;

                    return `

                        <tr>

                            <td>
                                #${escalation.id}
                            </td>

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
                                ${escalation.escalatedTo}
                            </td>

                            <td>
                                ${formatDate(
                        escalation.escalatedAt
                    )}
                            </td>

                            <td>

                                <a
                                    href="/grievance-details.html?id=${grievance.id}"
                                    class="btn btn-secondary">

                                    View

                                </a>

                            </td>

                        </tr>

                    `;

                }
            ).join("");


    } catch (error) {

        console.error(
            "Escalation Loading Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <h3>
                            Unable to load escalations
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
// FORMAT DATE
// ============================================================

function formatDate(dateValue) {

    if (!dateValue) {

        return "N/A";

    }

    const date =
        new Date(dateValue);

    return date.toLocaleString();

}


// ============================================================
// INITIAL LOAD
// ============================================================

loadEscalations();