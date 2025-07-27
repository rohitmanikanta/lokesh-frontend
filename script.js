
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  document.getElementById("themeText").innerText = isDark ? "Dark Mode" : "Light Mode";
}


function showTab(tab) {
  document.getElementById("encode-tab").style.display = tab === "encode" ? "block" : "none";
  document.getElementById("decode-tab").style.display = tab === "decode" ? "block" : "none";
}


function handleEncode() {
  const image = document.getElementById("encodeImage").files[0];
  const message = document.getElementById("secretMessage").value;
  const password = document.getElementById("encodePassword").value;

  if (!image || !message || !password) {
    alert("Image, message, and password are required.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);
  formData.append("message", `${password}::${message}`);

  fetch("http://localhost:5000/api/encode", {
    method: "POST",
    body: formData
  })
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "encoded_image.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(err => {
      console.error("Error encoding:", err);
      alert("Something went wrong. Try again.");
    });
}


function handleDecode() {
  const image = document.getElementById("decodeImage").files[0];
  const password = document.getElementById("decodePassword").value;

  if (!image || !password) {
    alert("Image and password are required.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);

  fetch("http://localhost:5000/api/decode", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (!data.message.includes("::")) {
        document.getElementById("decodedMessage").innerText = "Invalid or unprotected message.";
        return;
      }

      const [storedPass, msg] = data.message.split("::");
      if (storedPass !== password) {
        document.getElementById("decodedMessage").innerText = "Incorrect password!";
      } else {
        document.getElementById("decodedMessage").innerText = msg;
      }
    })
    .catch(err => {
      console.error("Error decoding:", err);
      alert("Something went wrong.");
    });
}


function speakMessage() {
  const msg = document.getElementById("decodedMessage").innerText;
  if (!msg || msg === "Incorrect password!" || msg === "Invalid or unprotected message.") {
    alert("No valid message to speak.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(msg);
  speechSynthesis.speak(utterance);
}
