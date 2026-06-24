const form = document.getElementById("hosForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    await fetch(
        "https://docs.google.com/forms/d/e/1FAIpQLScpwZCyKOVgasfMJ5DYPqML84PgqqlRfU4f4HeGlcAUKsEAOA/formResponse",
        {
            method:"POST",
            mode:"no-cors",
            body:formData
        }
    );

    form.reset();

    form.style.display = "none";

    document.getElementById("success").style.display = "block";

});