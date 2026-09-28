// ============================================================
// GRIEVANCETRACK - DEPARTMENTS
// ============================================================


// Current department being edited
let editingDepartmentId = null;


// ============================================================
// LOAD ALL DEPARTMENTS
// ============================================================

async function loadDepartments() {

    const table =
        document.getElementById("departmentsTable");


    try {

        const response =
            await fetch("/api/departments");


        if (!response.ok) {

            throw new Error(
                "Failed to load departments"
            );

        }


        const departments =
            await response.json();


        if (departments.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="4">

                        <div class="empty-state">

                            <h3>
                                No Departments Found
                            </h3>

                            <p>
                                Add a department using the form above.
                            </p>

                        </div>

                    </td>

                </tr>

            `;

            return;
        }


        table.innerHTML =
            departments.map(
                department => `

                    <tr>

                        <td>
                            #${department.id}
                        </td>

                        <td>
                            ${escapeHtml(
                    department.name
                )}
                        </td>

                        <td>
                            ${escapeHtml(
                    department.seniorOfficerName
                )}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="btn btn-secondary"
                                onclick="editDepartment(${department.id})">

                                Edit

                            </button>


                            <button
                                type="button"
                                class="btn btn-danger"
                                onclick="deleteDepartment(${department.id})">

                                Delete

                            </button>

                        </td>

                    </tr>

                `
            ).join("");


    } catch (error) {

        console.error(
            "Department Loading Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td colspan="4">

                    <div class="empty-state">

                        <h3>
                            Unable to load departments
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
// ADD / UPDATE DEPARTMENT
// ============================================================

async function saveDepartment(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "departmentName"
        ).value.trim();


    const seniorOfficerName =
        document.getElementById(
            "seniorOfficerName"
        ).value.trim();


    if (!name || !seniorOfficerName) {

        showMessage(
            "Please fill in all fields.",
            "error"
        );

        return;
    }


    const departmentData = {

        name: name,

        seniorOfficerName:
        seniorOfficerName

    };


    try {

        let response;


        // ====================================================
        // UPDATE
        // ====================================================

        if (editingDepartmentId !== null) {

            response =
                await fetch(
                    `/api/departments/${editingDepartmentId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                departmentData
                            )
                    }
                );

        }


            // ====================================================
            // CREATE
        // ====================================================

        else {

            response =
                await fetch(
                    "/api/departments",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                departmentData
                            )
                    }
                );

        }


        const result =
            await response.json();


        if (response.ok) {

            if (editingDepartmentId !== null) {

                showMessage(
                    "Department updated successfully.",
                    "success"
                );

            } else {

                showMessage(
                    "Department added successfully.",
                    "success"
                );

            }


            resetForm();

            loadDepartments();

        }


        else {

            showMessage(
                result.message ||
                "Unable to save department.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Save Department Error:",
            error
        );


        showMessage(
            "Server error. Please try again.",
            "error"
        );

    }

}


// ============================================================
// EDIT DEPARTMENT
// ============================================================

async function editDepartment(id) {

    try {

        const response =
            await fetch(
                `/api/departments/${id}`
            );


        if (!response.ok) {

            const result =
                await response.json();

            throw new Error(
                result.message ||
                "Department not found"
            );

        }


        const department =
            await response.json();


        document.getElementById(
            "departmentName"
        ).value =
            department.name;


        document.getElementById(
            "seniorOfficerName"
        ).value =
            department.seniorOfficerName;


        editingDepartmentId = id;


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Department";


        document.getElementById(
            "submitButton"
        ).textContent =
            "Update Department";


        document.getElementById(
            "cancelButton"
        ).style.display =
            "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        console.error(
            "Edit Department Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load department.",
            "error"
        );

    }

}


// ============================================================
// DELETE DEPARTMENT
// ============================================================

async function deleteDepartment(id) {


    const confirmed =
        confirm(
            "Are you sure you want to delete this department?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/departments/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.text();


        if (response.ok) {

            showMessage(
                "Department deleted successfully.",
                "success"
            );


            loadDepartments();

        }


        else {

            showMessage(
                result ||
                "Unable to delete department.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Delete Department Error:",
            error
        );


        showMessage(
            "Server error. Please try again.",
            "error"
        );

    }

}


// ============================================================
// CANCEL EDIT
// ============================================================

function cancelEdit() {

    resetForm();

}


// ============================================================
// RESET FORM
// ============================================================

function resetForm() {

    document.getElementById(
        "departmentForm"
    ).reset();


    editingDepartmentId = null;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Department";


    document.getElementById(
        "submitButton"
    ).textContent =
        "Add Department";


    document.getElementById(
        "cancelButton"
    ).style.display =
        "none";

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


    setTimeout(() => {

        messageBox.textContent = "";

        messageBox.className = "";

    }, 3000);

}


// ============================================================
// ESCAPE HTML
// Prevents HTML injection in table values
// ============================================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ============================================================
// FORM EVENT
// ============================================================

document
    .getElementById("departmentForm")
    .addEventListener(
        "submit",
        saveDepartment
    );


// ============================================================
// CANCEL BUTTON EVENT
// ============================================================

document
    .getElementById("cancelButton")
    .addEventListener(
        "click",
        cancelEdit
    );


// ============================================================
// INITIAL LOAD
// ============================================================

loadDepartments();