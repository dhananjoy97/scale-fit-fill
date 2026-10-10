(function () {
  function evalHost(functionCall) {
    if (!window.__adobe_cep__) {
      return;
    }

    window.__adobe_cep__.evalScript(functionCall, function (result) {
      if (result && result !== "ok") {
        alert(result);
      }
    });
  }

  document.getElementById("fit").addEventListener("click", function () {
    evalHost("scaleFitFill('fit')");
  });

  document.getElementById("fill").addEventListener("click", function () {
    evalHost("scaleFitFill('fill')");
  });
})();
