// ============================================================
// GRIEVANCETRACK - CATEGORIES
// ============================================================


let editingCategoryId = null;


// ============================================================
// LOAD DEPARTMENTS
// ============================================================

async function loadDepartments() {

    const departmentSelect =
        document.getElementById("department");


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


        departmentSelect.innerHTML = `

            <option value="">
                Select Department
            </option>

        `;


        departments.forEach(department => {

            const option =
                document.createElement("option");

            option.value =
                department.id;

            option.textContent =
                department.name;

            departmentSelect.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Department Loading Error:",
            error
        );


        showMessage(
            "Unable to load departments.",
            "error"
        );

    }

}


// ============================================================
// LOAD CATEGORIES
// ============================================================

async function loadCategories() {

    const table =
        document.getElementById(
            "categoriesTable"
        );


    try {

        const response =
            await fetch("/api/categories");


        if (!response.ok) {

            throw new Error(
                "Failed to load categories"
            );

        }


        const categories =
            await response.json();


        if (categories.length === 0) {

            table.innerHTML = `

                <tr>

                    <td colspan="5">

                        <div class="empty-state">

                            <h3>
                                No Categories Found
                            </h3>

                            <p>
                                Add a category using the form above.
                            </p>

                        </div>

                    </td>

                </tr>

            `;

            return;

        }


        table.innerHTML =
            categories.map(
                category => `

                    <tr>

                        <td>
                            #${category.id}
                        </td>

                        <td>
                            ${escapeHtml(
                    category.name
                )}
                        </td>

                        <td>
                            ${category.slaDays} days
                        </td>

                        <td>
                            ${
                    category.department
                        ? escapeHtml(
                            category.department.name
                        )
                        : "N/A"
                }
                        </td>

                        <td>

                            <button
                                type="button"
                                class="btn btn-secondary"
                                onclick="editCategory(${category.id})">

                                Edit

                            </button>


                            <button
                                type="button"
                                class="btn btn-danger"
                                onclick="deleteCategory(${category.id})">

                                Delete

                            </button>

                        </td>

                    </tr>

                `
            ).join("");


    } catch (error) {

        console.error(
            "Category Loading Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td colspan="5">

                    <div class="empty-state">

                        <h3>
                            Unable to load categories
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
// ADD / UPDATE CATEGORY
// ============================================================

async function saveCategory(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "categoryName"
        ).value.trim();


    const slaDays =
        document.getElementById(
            "slaDays"
        ).value;


    const departmentId =
        document.getElementById(
            "department"
        ).value;


    if (
        !name ||
        !slaDays ||
        !departmentId
    ) {

        showMessage(
            "Please fill in all fields.",
            "error"
        );

        return;

    }


    if (Number(slaDays) <= 0) {

        showMessage(
            "SLA days must be greater than 0.",
            "error"
        );

        return;

    }


    const categoryData = {

        name: name,

        slaDays: Number(slaDays),

        department: {

            id: Number(departmentId)

        }

    };


    try {

        let response;


        // ====================================================
        // UPDATE
        // ====================================================

        if (editingCategoryId !== null) {

            response =
                await fetch(
                    `/api/categories/${editingCategoryId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                categoryData
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
                    "/api/categories",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                categoryData
                            )
                    }
                );

        }


        const result =
            await response.json();


        if (response.ok) {

            if (editingCategoryId !== null) {

                showMessage(
                    "Category updated successfully.",
                    "success"
                );

            } else {

                showMessage(
                    "Category added successfully.",
                    "success"
                );

            }


            resetForm();

            loadCategories();

        }


        else {

            showMessage(
                result.message ||
                "Unable to save category.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Save Category Error:",
            error
        );


        showMessage(
            "Server error. Please try again.",
            "error"
        );

    }

}


// ============================================================
// EDIT CATEGORY
// ============================================================

async function editCategory(id) {

    try {

        const response =
            await fetch(
                `/api/categories/${id}`
            );


        if (!response.ok) {

            const result =
                await response.json();

            throw new Error(
                result.message ||
                "Category not found"
            );

        }


        const category =
            await response.json();


        document.getElementById(
            "categoryName"
        ).value =
            category.name;


        document.getElementById(
            "slaDays"
        ).value =
            category.slaDays;


        if (category.department) {

            document.getElementById(
                "department"
            ).value =
                category.department.id;

        }


        editingCategoryId = id;


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Category";


        document.getElementById(
            "submitButton"
        ).textContent =
            "Update Category";


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
            "Edit Category Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to load category.",
            "error"
        );

    }

}


// ============================================================
// DELETE CATEGORY
// ============================================================

async function deleteCategory(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/categories/${id}`,
                {
                    method: "DELETE"
                }
            );


        const result =
            await response.text();


        if (response.ok) {

            showMessage(
                "Category deleted successfully.",
                "success"
            );


            loadCategories();

        }


        else {

            showMessage(
                result ||
                "Unable to delete category.",
                "error"
            );

        }


    } catch (error) {

        console.error(
            "Delete Category Error:",
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
        "categoryForm"
    ).reset();


    editingCategoryId = null;


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Category";


    document.getElementById(
        "submitButton"
    ).textContent =
        "Add Category";


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
// ============================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

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
    .getElementById("categoryForm")
    .addEventListener(
        "submit",
        saveCategory
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

async function initializePage() {

    await loadDepartments();

    await loadCategories();

}

initializePage();