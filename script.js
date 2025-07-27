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

  fetch("https://lokesh-backend.onrender.com/api/encode", {
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

  fetch("https://lokesh-backend.onrender.com/api/decode", {
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
