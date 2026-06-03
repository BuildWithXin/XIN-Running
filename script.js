(function () {
  "use strict";

  function init() {
    var form = document.getElementById("explore-form");
    var messageEl = document.getElementById("form-message");

    if (!form) {
      return;
    }

    function showMessage(text, type) {
      if (!messageEl) {
        return;
      }
      messageEl.textContent = text;
      messageEl.className = "form-message" + (type ? " " + type : "");
    }

    function clearInvalidStates() {
      var fields = form.querySelectorAll(".invalid");
      for (var i = 0; i < fields.length; i++) {
        fields[i].classList.remove("invalid");
      }
    }

    function validateForm(data) {
      var isValid = true;

      if (!data.city) {
        document.getElementById("city").classList.add("invalid");
        isValid = false;
      }

      if (!data.hotel) {
        document.getElementById("hotel").classList.add("invalid");
        isValid = false;
      }

      if (!data.distance) {
        document.getElementById("distance").classList.add("invalid");
        isValid = false;
      }

      return isValid;
    }

    function saveSearch(data) {
      try {
        sessionStorage.setItem("xinRunningSearch", JSON.stringify(data));
      } catch (err) {
        /* sessionStorage may be unavailable on file:// in some browsers */
      }
    }

    form.addEventListener("submit", function (event) {
      clearInvalidStates();
      showMessage("");

      var cityInput = document.getElementById("city");
      var hotelInput = document.getElementById("hotel");
      var distanceInput = document.getElementById("distance");

      var data = {
        city: (cityInput.value || "").trim(),
        hotel: (hotelInput.value || "").trim(),
        distance: distanceInput.value || ""
      };

      if (!validateForm(data)) {
        event.preventDefault();
        showMessage("请先填写完整信息，再开始探索。", "error");
        return;
      }

      cityInput.value = data.city;
      hotelInput.value = data.hotel;

      saveSearch(data);

      var params = new URLSearchParams({
        city: data.city,
        hotel: data.hotel,
        distance: data.distance
      });

      event.preventDefault();
      window.location.assign("results.html?" + params.toString());
    });

    var inputs = form.querySelectorAll("input, select");
    for (var j = 0; j < inputs.length; j++) {
      inputs[j].addEventListener("input", function () {
        this.classList.remove("invalid");
      });
      inputs[j].addEventListener("change", function () {
        this.classList.remove("invalid");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
