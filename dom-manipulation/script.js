
    // Sample quotes array
    let quotes = [
      { text: "The best way to predict the future is to invent it.", category: "Motivation" },
      { text: "Simplicity is the soul of efficiency.", category: "Design" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];

    // Validation function
    function isValidQuotesArray(arr) {
      return (
        Array.isArray(arr) &&
        arr.every(q =>
          typeof q === "object" &&
          q !== null &&
          typeof q.text === "string" &&
          typeof q.category === "string"
        )
      );
    }

    // Validate and initialize
    if (!isValidQuotesArray(quotes)) {
      console.error("Invalid or missing 'quotes' array. Using empty fallback.");
      quotes = [];
    }

    // Run on load
    window.onload = () => {
      updateCategoryDropdown();
      document.getElementById("newQuote").addEventListener("click", showRandomQuote);
    };

    // Show a random quote from selected category
    function showRandomQuote() {
      const selectedCategory = document.getElementById("categorySelect").value;
      const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
      const display = document.getElementById("quoteDisplay");

      if (filteredQuotes.length === 0) {
        display.innerText = "No quotes available in this category.";
        return;
      }

      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
      display.innerHTML = `"${quote.text}" <span id="quoteCategory">— ${quote.category}</span>`;
    }

    // Add a new quote and update dropdown
    function addQuote() {
      const text = document.getElementById("newQuoteText").value.trim();
      const category = document.getElementById("newQuoteCategory").value.trim();

      if (!text || !category) {
        alert("Please enter both quote and category.");
        return;
      }

      quotes.push({ text, category });
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      updateCategoryDropdown();
      alert("Quote added successfully!");
    }

    // Update the dropdown menu with unique categories
    function updateCategoryDropdown() {
      const dropdown = document.getElementById("categorySelect");
      const uniqueCategories = [...new Set(quotes.map(q => q.category))];

      dropdown.innerHTML = "";
      uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
      });
    }