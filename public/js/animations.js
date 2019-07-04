function scale(el, amount, speed) {
  el.style.transition = "transform " + speed + "s ease";
  el.style.transform = "scale(" + amount + ")";
}

function scaleY(el, amount, speed) {
  el.style.transition = "transform " + speed + "s";
  el.style.transform = "scaleY(" + amount + ")";
}

function height(el, amount, speed) {
  el.style.transition = "height " + speed + "s ease";
  el.style.height = amount + "%";
}

function width(el, amount, speed) {
  el.style.transition = "width " + speed + "s ease";
  el.style.width = amount + "%";
}

function deleteElement(el, delay) {
  setTimeout(() => {
    el.parentElement.removeChild(el);
  }, delay*1000);
}
