// ============================================================
// GRIEVANCETRACK - SUBMIT GRIEVANCE
// ============================================================


// ============================================================
// LOAD CATEGORIES
// ============================================================

async function loadCategories() {

    try {

        const response = await fetch("/api/categories");

        if (!response.ok) {
            throw new Error("Failed to load categories");
        }

        const categories = await response.json();

        const categorySelect =
            document.getElementById("category");


        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value = category.id;

            option.textContent =
                `${category.name} - SLA ${category.slaDays} days`;

            categorySelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Category Loading Error:",
            error
        );

        showMessage(
            "Unable to load categories.",
            "error"
        );

    }

}



// ============================================================
// SUBMIT GRIEVANCE
// ============================================================

async function submitGrievance(event) {

    event.preventDefault();


    const citizenName =
        document.getElementById("citizenName")
            .value
            .trim();


    const description =
        document.getElementById("description")
            .value
            .trim();


    const location =
        document.getElementById("location")
            .value
            .trim();


    const categoryId =
        document.getElementById("category")
            .value;



    // ========================================================
    // BASIC VALIDATION
    // ========================================================

    if (
        !citizenName ||
        !description ||
        !location ||
        !categoryId
    ) {

        showMessage(
            "Please fill in all required fields.",
            "error"
        );

        return;
    }



    // ========================================================
    // REQUEST DATA
    // ========================================================

    const grievanceData = {

        citizenName: citizenName,

        description: description,

        location: location,

        category: {
            id: Number(categoryId)
        }

    };



    try {

        const response = await fetch(
            "/api/grievances",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(grievanceData)
            }
        );


        const result =
            await response.json();



        // ====================================================
        // SUCCESS
        // ====================================================

        if (response.ok) {

            showMessage(
                "Grievance submitted successfully!",
                "success"
            );


            document
                .getElementById("grievanceForm")
                .reset();


            // Wait and go to grievance list
            setTimeout(() => {

                window.location.href =
                    "/grievances.html";

            }, 1200);


        }

            // ====================================================
            // ERROR
        // ====================================================

        else {

            showMessage(
                result.message ||
                "Unable to submit grievance.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Submit Error:",
            error
        );


        showMessage(
            "Server error. Please try again.",
            "error"
        );

    }

}



// ============================================================
// SHOW MESSAGE
// ============================================================

function showMessage(message, type) {

    const messageBox =
        document.getElementById("message");


    messageBox.className =
        `alert alert-${type}`;


    messageBox.textContent =
        message;

}



// ============================================================
// FORM EVENT
// ============================================================

document
    .getElementById("grievanceForm")
    .addEventListener(
        "submit",
        submitGrievance
    );



// ============================================================
// INITIAL LOAD
// ============================================================

loadCategories();