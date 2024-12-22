document.getElementById("logout").addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
  
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        window.location.href = "index.html";
      } else {
        alert("Fehler beim Abmelden. Bitte versuche es später erneut.");
      }
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
      alert("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
    }
  });