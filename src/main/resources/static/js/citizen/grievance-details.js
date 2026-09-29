document.addEventListener("DOMContentLoaded", loadGrievance);

const params = new URLSearchParams(window.location.search);
const grievanceId = params.get("id");


async function loadGrievance() {

    if (!grievanceId) {
        showError("Grievance ID is missing.");
        return;
    }

    try {

        const response =
            await fetch(`/api/grievances/${grievanceId}`);

        if (!response.ok) {
            throw new Error("Grievance not found");
        }

        const grievance = await response.json();

        displayGrievance(grievance);

    } catch (error) {

        console.error(error);

        showError(
            "Unable to load grievance details."
        );
    }
}


function displayGrievance(grievance) {

    document.getElementById("loadingMessage")
        .classList.add("hidden");

    document.getElementById("detailsContent")
        .classList.remove("hidden");


    document.getElementById("grievanceId")
        .textContent = `#${grievance.id}`;

    document.getElementById("citizenName")
        .textContent = grievance.citizenName || "-";

    document.getElementById("category")
        .textContent =
        grievance.category?.name || "-";

    document.getElementById("department")
        .textContent =
        grievance.category?.department?.name || "-";

    document.getElementById("location")
        .textContent = grievance.location || "-";

    document.getElementById("sla")
        .textContent =
        grievance.category?.slaDays
            ? `${grievance.category.slaDays} days`
            : "-";

    document.getElementById("createdAt")
        .textContent = formatDate(grievance.createdAt);

    document.getElementById("resolvedAt")
        .textContent =
        formatDate(grievance.resolvedAt);

    document.getElementById("description")
        .textContent =
        grievance.description || "-";


    document.getElementById("currentStatus")
        .textContent =
        formatStatus(grievance.status);


    updateStatusMessage(grievance.status);

    updateTimeline(grievance.status);

    loadRatingSection(grievance);
}


function updateStatusMessage(status) {

    const message =
        document.getElementById("statusMessage");

    const messages = {

        SUBMITTED:
            "Your grievance has been successfully submitted.",

        ASSIGNED:
            "Your grievance has been assigned to the responsible department.",

        IN_PROGRESS:
            "The department is currently working on your grievance.",

        RESOLVED:
            "Your grievance has been resolved and is ready for closure.",

        CLOSED:
            "Your grievance has been closed.",

        ESCALATED:
            "Your grievance exceeded its SLA and has been escalated to a senior officer."
    };

    message.textContent =
        messages[status] ||
        "Your grievance is being processed.";
}


function updateTimeline(status) {

    const steps = {

        SUBMITTED: 1,
        ASSIGNED: 2,
        IN_PROGRESS: 3,
        RESOLVED: 4,
        CLOSED: 5
    };

    const currentStep = steps[status] || 0;

    const stepIds = [
        "stepSubmitted",
        "stepAssigned",
        "stepProgress",
        "stepResolved",
        "stepClosed"
    ];

    stepIds.forEach((id, index) => {

        const element =
            document.getElementById(id);

        element.classList.remove(
            "completed",
            "current"
        );

        const stepNumber = index + 1;

        if (stepNumber < currentStep) {

            element.classList.add("completed");

        } else if (stepNumber === currentStep) {

            element.classList.add("current");
        }
    });


    // Escalated status
    if (status === "ESCALATED") {

        document.getElementById("stepSubmitted")
            .classList.add("completed");

        document.getElementById("stepAssigned")
            .classList.add("completed");

        document.getElementById("stepProgress")
            .classList.add("current");

    }
}


function loadRatingSection(grievance) {

    const ratingSection =
        document.getElementById("ratingSection");

    if (grievance.status === "CLOSED") {

        ratingSection.classList.remove("hidden");

        const ratingSelect =
            document.getElementById("rating");

        if (grievance.rating) {

            ratingSelect.value =
                grievance.rating;

            ratingSelect.disabled = true;

            document.getElementById("ratingButton")
                .disabled = true;

            document.getElementById("ratingButton")
                .textContent = "Rating Submitted";
        }

        document.getElementById("ratingButton")
            .addEventListener(
                "click",
                submitRating
            );
    }
}


async function submitRating() {

    const rating =
        document.getElementById("rating").value;

    if (!rating) {

        showMessage(
            "Please select a rating.",
            "error"
        );

        return;
    }


    try {

        const response = await fetch(
            `/api/grievances/${grievanceId}/rating?rating=${rating}`,
            {
                method: "PUT"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to submit rating"
            );
        }


        showMessage(
            "Thank you! Your rating has been submitted successfully.",
            "success"
        );


        document.getElementById("rating")
            .disabled = true;

        document.getElementById("ratingButton")
            .disabled = true;

        document.getElementById("ratingButton")
            .textContent = "Rating Submitted";


    } catch (error) {

        showMessage(
            error.message,
            "error"
        );
    }
}


function showMessage(message, type) {

    const element =
        document.getElementById("message");

    element.className =
        `alert alert-${type}`;

    element.textContent = message;
}


function showError(message) {

    const loading =
        document.getElementById("loadingMessage");

    loading.innerHTML = `
        <div class="alert alert-error">
            ${message}
        </div>
    `;
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

    return new Date(dateString)
        .toLocaleString();
}