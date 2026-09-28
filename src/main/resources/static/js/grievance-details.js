// ============================================================
// GRIEVANCETRACK - GRIEVANCE DETAILS
// ============================================================


// ============================================================
// GET GRIEVANCE ID FROM URL
// ============================================================

const urlParams =
    new URLSearchParams(window.location.search);

const grievanceId =
    urlParams.get("id");


// ============================================================
// LOAD GRIEVANCE DETAILS
// ============================================================

async function loadGrievance() {

    if (!grievanceId) {

        showMessage(
            "Grievance ID is missing.",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/grievances/${grievanceId}`
            );


        if (!response.ok) {

            const result =
                await response.json();

            throw new Error(
                result.message ||
                "Unable to load grievance."
            );

        }


        const grievance =
            await response.json();


        displayGrievance(grievance);


    } catch (error) {

        console.error(
            "Grievance Details Error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to load grievance.",
            "error"
        );

    }

}


// ============================================================
// DISPLAY GRIEVANCE
// ============================================================

function displayGrievance(grievance) {


    document.getElementById(
        "grievanceId"
    ).textContent =
        `#${grievance.id}`;


    document.getElementById(
        "citizenName"
    ).textContent =
        grievance.citizenName;


    document.getElementById(
        "description"
    ).textContent =
        grievance.description;


    document.getElementById(
        "location"
    ).textContent =
        grievance.location;


    document.getElementById(
        "categoryName"
    ).textContent =
        grievance.category
            ? grievance.category.name
            : "N/A";


    document.getElementById(
        "departmentName"
    ).textContent =
        grievance.category &&
        grievance.category.department
            ? grievance.category.department.name
            : "N/A";


    document.getElementById(
        "slaDays"
    ).textContent =
        grievance.category
            ? `${grievance.category.slaDays} days`
            : "N/A";


    document.getElementById(
        "createdAt"
    ).textContent =
        formatDate(grievance.createdAt);


    document.getElementById(
        "resolvedAt"
    ).textContent =
        grievance.resolvedAt
            ? formatDate(grievance.resolvedAt)
            : "Not resolved";


    document.getElementById(
        "currentStatus"
    ).innerHTML = `

        <span class="status status-${getStatusClass(grievance.status)}">

            ${formatStatus(grievance.status)}

        </span>

    `;


    document.getElementById(
        "currentRating"
    ).textContent =
        grievance.rating
            ? `${grievance.rating} / 5`
            : "Not Rated";


    // Set current status in dropdown
    document.getElementById(
        "status"
    ).value =
        grievance.status;


    // If grievance is already closed,
    // disable status update.
    if (grievance.status === "CLOSED") {

        document.getElementById(
            "status"
        ).disabled = true;

    }


    // Rating is allowed only after CLOSED
    if (grievance.status !== "CLOSED") {

        document.getElementById(
            "rating"
        ).disabled = true;

    }


    // If already rated, disable rating
    if (grievance.rating) {

        document.getElementById(
            "rating"
        ).disabled = true;

    }

}


// ============================================================
// UPDATE STATUS
// ============================================================

async function updateStatus() {


    const status =
        document.getElementById(
            "status"
        ).value;


    if (!status) {

        showMessage(
            "Please select a status.",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/grievances/${grievanceId}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            showMessage(
                "Grievance status updated successfully.",
                "success"
            );


            setTimeout(() => {

                loadGrievance();

            }, 500);

        } else {

            showMessage(
                result.message ||
                "Unable to update status.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Status Update Error:",
            error
        );

        showMessage(
            "Server error. Please try again.",
            "error"
        );

    }

}


// ============================================================
// ADD RATING
// ============================================================

async function addRating() {


    const rating =
        document.getElementById(
            "rating"
        ).value;


    if (!rating) {

        showMessage(
            "Please select a rating.",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/grievances/${grievanceId}/rating?rating=${rating}`,
                {
                    method: "PUT"
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            showMessage(
                "Rating submitted successfully.",
                "success"
            );


            setTimeout(() => {

                loadGrievance();

            }, 500);

        } else {

            showMessage(
                result.message ||
                "Unable to submit rating.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Rating Error:",
            error
        );

        showMessage(
            "Server error. Please try again.",
            "error"
        );

    }

}


// ============================================================
// DELETE GRIEVANCE
// ============================================================

async function deleteGrievance() {


    const confirmed =
        confirm(
            "Are you sure you want to delete this grievance?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/grievances/${grievanceId}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.text();


        if (response.ok) {

            alert(
                "Grievance deleted successfully."
            );


            window.location.href =
                "/grievances.html";

        } else {

            showMessage(
                result ||
                "Unable to delete grievance.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        showMessage(
            "Server error. Please try again.",
            "error"
        );

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
// SHOW MESSAGE
// ============================================================

function showMessage(message, type) {

    const messageBox =
        document.getElementById(
            "message"
        );


    messageBox.className =
        `alert alert-${type}`;


    messageBox.textContent =
        message;

}


// ============================================================
// INITIAL LOAD
// ============================================================

loadGrievance();