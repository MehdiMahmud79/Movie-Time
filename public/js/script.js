const errorHandler = (message) => {
  $("#alertMessage").empty();
  errMessage = ` <div id="alertMessage" class="alert alert-danger alert-dismissible fade show " role="alert">
  <strong><i class="fas fa-exclamation-triangle"></i></strong> <span>${message}</span> 
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
  $("#alertMessage").append(errMessage);
  return;
};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const loginFormHandler = async (event) => {
  event.preventDefault();
  console.log("hi login");
  // Collect values from the login form
  const email = $("#email-login").val().trim().toLowerCase();
  const password = $("#password-login").val().trim();
  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    resMessage = await response.json();
    console.log("before response.ok");

    if (response.ok) {
      console.log(" response.ok");
      document.location.replace("/");
    } else {
      console.log(" response not ok");

      errorHandler(resMessage.message);

      return;
    }
    return;
  }
  errorHandler("Error: Fill in the requiered fileds!");

  return;
};

const signupFormHandler = async (event) => {
  event.preventDefault();
  const userName = capitalizeFirstLetter(
    $("#name-signup").val().toLowerCase()
  ).trim();
  const email = $("#email-signup").val().trim().toLowerCase();
  const password = $("#password-signup").val().trim();
  const password2 = $("#password-signup2").val().trim();
  if (!userName || !email || !password | !password2) {
    errorHandler("Error: Fill in the requiered fileds");
    return;
  }
  if (password !== password2) {
    errorHandler("Error: Password should match!");
    return;
  }
  if (password.length < 8) {
    errorHandler("Error: Password should be at least 8 characters!");
    return;
  }
  if (userName && email && password && password2) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ userName, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    resMessage = await response.json();
    if (response.ok) {
      document.location.replace("/profile");
    } else {
      errorHandler(resMessage.message);
      return;
    }
  }
};

const logout = async () => {
  const response = await fetch("/api/users/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    errorHandler(response.statusText);
    return;
  }
};

const updateUserName = async (event) => {
  const userName = capitalizeFirstLetter(
    $("#userChange").val().lowerCase()
  ).trim();
  event.preventDefault();
  if (userName) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/update", {
      method: "PUT",
      body: JSON.stringify({ userName: userName }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/profile");
    } else {
      errorHandler(response.statusText);
      return;
    }
  } else {
    errorHandler("Use Name can't be empty!");
    return;
  }
};

const updateUser = async (event) => {
  const email = $("#user-email").val().toLowerCase().trim();
  const userName = capitalizeFirstLetter(
    $("#userName").val().toLowerCase()
  ).trim();
  const currentPassword = $("#current-password").val();
  const newPassword = $("#new-password").val();
  event.preventDefault();
  if (email && userName && currentPassword && newPassword) {
    // Send a POST request to the API endpoint
    const response = await fetch("/api/users/update", {
      method: "PUT",
      body: JSON.stringify({
        email: email,
        userName: userName,
        password: currentPassword,
        newPassword: newPassword,
      }),
      headers: { "Content-Type": "application/json" },
    });
    resMessage = await response.json();

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace("/profile");
      errorHandler(resMessage.message);
    } else {
      errorHandler(resMessage.message);
      return;
    }
  } else {
    errorHandler("Fields can't be empty!");
    return;
  }
};

$(".login-form").on("submit", loginFormHandler);

$(".signup-form").on("submit", signupFormHandler);

$(".userName-form").on("submit", updateUserName);
$(".update-form").on("submit", updateUser);

$("#logout").on("click", logout);
