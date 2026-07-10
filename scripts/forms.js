/* ══════════════════════════════════════════════════════════════════
   HOUSE OF SUDAN — FORMS ENGINE
   One shared engine for every submission form. Page scripts
   (join-network.js, employers.js) just call:

       HOS.initForm("#hosForm");

   Each <form> needs:
     - id + novalidate (already in the HTML)
     - data-form-id="GOOGLE_FORM_ID"   ← the ID from the form's
       "https://docs.google.com/forms/d/e/GOOGLE_FORM_ID/viewform" URL
     - inputs whose name="entry.XXXXXXX" attributes already match the
       Google Form's fields (already in the HTML)

   The surrounding page needs:
     - #formSection wrapping the form
     - #success as the confirmation panel
   ══════════════════════════════════════════════════════════════════ */

window.HOS = window.HOS || {};

(function (HOS) {
    "use strict";

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function initForm(formSelector) {
        var form = document.querySelector(formSelector);
        if (!form) return;

        var formId = form.getAttribute("data-form-id");
        var submitBtn = form.querySelector(".btn-submit");
        var submitLabel = submitBtn ? submitBtn.textContent : "Submit";
        var formSection = document.getElementById("formSection");
        var success = document.getElementById("success");
        var errorBox = ensureErrorBox(form);

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            hideError(errorBox);

            var invalidField = validate(form);
            if (invalidField) {
                invalidField.focus();
                showError(errorBox, "Please fill in the required fields before submitting.");
                return;
            }

            if (!formId || formId === "REPLACE_WITH_GOOGLE_FORM_ID") {
                showError(errorBox, "This form isn't fully connected yet — please contact House of Sudan directly for now.");
                return;
            }

            submit(form, formId, submitBtn, submitLabel)
                .then(function () { showSuccess(formSection, success); })
                .catch(function () {
                    showError(errorBox, "Something went wrong sending your submission. Please check your connection and try again.");
                });
        });

        // clear the error state on a field the moment someone fixes it
        form.addEventListener("input", function (e) {
            if (e.target.classList && e.target.classList.contains("error")) {
                e.target.classList.remove("error");
            }
        });
    }

    function validate(form) {
        var firstInvalid = null;

        form.querySelectorAll("[required]").forEach(function (field) {
            var isEmpty = !field.value || !field.value.trim();
            var isBadEmail = field.type === "email" && field.value && !EMAIL_RE.test(field.value.trim());

            if (isEmpty || isBadEmail) {
                field.classList.add("error");
                if (!firstInvalid) firstInvalid = field;
            } else {
                field.classList.remove("error");
            }
        });

        return firstInvalid;
    }

    function submit(form, formId, submitBtn, submitLabel) {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending…";
        }

        var action = "https://docs.google.com/forms/u/0/d/e/" + formId + "/formResponse";
        var data = new FormData(form);

        return fetch(action, { method: "POST", mode: "no-cors", body: data })
            .then(function () { return true; })
            .finally(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = submitLabel;
                }
            });
    }

    function showSuccess(formSection, success) {
        if (!formSection || !success) return;
        formSection.style.display = "none";
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function ensureErrorBox(form) {
        var existing = form.querySelector(".form-error");
        if (existing) return existing;

        var p = document.createElement("p");
        p.className = "form-error";
        p.setAttribute("role", "alert");
        var submitRow = form.querySelector(".submit-row");
        if (submitRow) {
            submitRow.parentNode.insertBefore(p, submitRow.nextSibling);
        } else {
            form.appendChild(p);
        }
        return p;
    }

    function showError(box, message) {
        if (!box) return;
        box.textContent = message;
        box.classList.add("is-visible");
    }

    function hideError(box) {
        if (!box) return;
        box.classList.remove("is-visible");
    }

    HOS.initForm = initForm;
})(window.HOS);