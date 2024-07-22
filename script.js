function initialize() {
  const colorCircle = document.getElementById("colorCircle");
  const colorSlider = document.getElementById("colorSlider");
  const colorSectionsContainer = document.getElementById("colorSections");

  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      const colors = data.colors;
      createColorSections(colors);
      colorSlider.addEventListener("input", (e) => updateCircleColor(e.target.value, colors));
      colorSlider.addEventListener("change", (e) => snapToNearestTick(e.target, colors));
      updateCircleColor(colorSlider.value, colors);
    })
    .catch(error => console.error("Fetch Error:", error));

  function createColorSections(colors) {
    colors.forEach(colorObj => {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "colorSection";

      const colorDot = document.createElement("div");
      colorDot.className = "colorTick";
      colorDot.style.backgroundColor = colorObj.color;

      const colorName = document.createElement("div");
      colorName.className = "colorName";
      colorName.textContent = colorObj.color;

      colorName.addEventListener("click", () => {
        colorCircle.style.backgroundColor = colorObj.color;
        colorSlider.value = colorObj.value;
        snapToNearestTick(colorSlider, colors);
      });

      sectionDiv.appendChild(colorDot);
      sectionDiv.appendChild(colorName);
      colorSectionsContainer.appendChild(sectionDiv);
    });
  }

  function updateCircleColor(value, colors) {
    let selectedColor = colors[0].color;
    let minDiff = Math.abs(value - colors[0].value);

    colors.forEach(colorObj => {
      const diff = Math.abs(value - colorObj.value);
      if (diff < minDiff) {
        selectedColor = colorObj.color;
        minDiff = diff;
      }
    });

    colorCircle.style.backgroundColor = selectedColor;
  }

  function snapToNearestTick(slider, colors) {
    const sliderValue = parseInt(slider.value, 10);
    const nearestTick = colors.reduce((prev, curr) => 
      Math.abs(curr.value - sliderValue) < Math.abs(prev.value - sliderValue) ? curr : prev
    );
    slider.value = nearestTick.value;
    colorCircle.style.backgroundColor = nearestTick.color;
  }
}