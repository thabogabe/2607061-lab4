const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const spinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    try {
        // Clear previous results
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "";
        errorMessage.textContent = "";

        spinner.style.display = "block";

        if (!countryName) {
            throw new Error("Please enter a country name.");
        }

        // ✅ FULL TEXT MATCH ADDED
        const response = await fetch(
            `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );

        if (!response.ok) {
            throw new Error("Country not found. Please enter a valid country name.");
        }

        const data = await response.json();
        const country = data[0];

        // Main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" 
                 alt="${country.name.common} flag" 
                 width="150">
        `;

        //  FIXED BORDER STRUCTURE
        if (country.borders && country.borders.length > 0) {

            borderingCountries.innerHTML = `
                
                <div class="border-grid" id="border-grid"></div>
            `;

            const grid = document.getElementById("border-grid");

            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                    .then(res => res.json())
            );

            const borderResults = await Promise.all(borderPromises);

            borderResults.forEach(borderData => {
                const border = borderData[0];

                grid.innerHTML += `
                    <div>
                        <img src="${border.flags.svg}" 
                             alt="${border.name.common} flag" 
                             width="150">
                        <p>${border.name.common}</p>
                    </div>
                `;
            });

        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    } finally {
        spinner.style.display = "none";
    }
}

// Click event
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    searchCountry(country);
});

// Enter key event
document.getElementById('country-input').addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        const country = event.target.value.trim();
        searchCountry(country);
    }
});