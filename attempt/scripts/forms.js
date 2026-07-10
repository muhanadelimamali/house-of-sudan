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

   HOW IT SUBMITS:
   The form POSTs directly into a hidden <iframe> — the same technique
   Google's own embedded forms use. This avoids fetch()/CORS entirely,
   so it isn't affected by cross-origin restrictions or the stricter
   CSPs some in-app browsers (e.g. Instagram's built-in browser) apply
   to fetch requests. It's a real, native form submission; the iframe
   just keeps it from navigating the whole page away.
   ══════════════════════════════════════════════════════════════════ */

window.HOS = window.HOS || {};

(function (HOS) {
    "use strict";

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var RESPONSE_TIMEOUT_MS = 9000;

    function initForm(formSelector) {
        var form = document.querySelector(formSelector);
        if (!form) return;

        var formId = form.getAttribute("data-form-id");
        var submitBtn = form.querySelector(".btn-submit");
        var submitLabel = submitBtn ? submitBtn.textContent : "Submit";
        var formSection = document.getElementById("formSection");
        var success = document.getElementById("success");
        var errorBox = ensureErrorBox(form);

        var frameName = "hos-frame-" + Math.random().toString(36).slice(2);
        var frame = createHiddenFrame(frameName);
        var awaitingResponse = false;
        var timeoutId = null;

        // Fires once the hidden iframe finishes navigating — i.e. once
        // Google has responded to the POST. Ignore the very first load,
        // which is just the iframe's own initial blank page.
        frame.addEventListener("load", function () {
            if (!awaitingResponse) return;
            awaitingResponse = false;
            window.clearTimeout(timeoutId);
            resetButton();
            showSuccess(formSection, success);
        });

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

            form.action = "https://docs.google.com/forms/u/0/d/e/" + formId + "/formResponse";
            form.method = "POST";
            form.target = frameName;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Sending…";
            }

            awaitingResponse = true;
            timeoutId = window.setTimeout(function () {
                if (!awaitingResponse) return;
                awaitingResponse = false;
                resetButton();
                showError(errorBox, "This is taking longer than expected. Please check your connection and try again.");
            }, RESPONSE_TIMEOUT_MS);

            // form.submit() bypasses the "submit" event entirely, so this
            // can't loop back into this same handler.
            form.submit();
        });

        // clear the error state on a field the moment someone fixes it
        form.addEventListener("input", function (e) {
            if (e.target.classList && e.target.classList.contains("error")) {
                e.target.classList.remove("error");
            }
        });

        function resetButton() {
            if (!submitBtn) return;
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
        }
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

    function createHiddenFrame(name) {
        var iframe = document.createElement("iframe");
        iframe.name = name;
        iframe.className = "hos-hidden-frame";
        iframe.setAttribute("aria-hidden", "true");
        iframe.setAttribute("tabindex", "-1");
        iframe.setAttribute("title", "form submission target");
        document.body.appendChild(iframe);
        return iframe;
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